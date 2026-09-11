#!/usr/bin/env node
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { parseLegacyDump } from "./audit-legacy-dump.mjs";

const inputArg = process.argv.indexOf("--input");
if (inputArg < 0 || !process.argv[inputArg + 1]) {
  console.error("Usage: node scripts/build-p2-inventory.mjs --input /path/to/data_vietaustravel [--output inventory.json]");
  process.exit(2);
}
const input = path.resolve(process.argv[inputArg + 1]);
const outputArg = process.argv.indexOf("--output");
const output = outputArg >= 0 && process.argv[outputArg + 1] ? path.resolve(process.argv[outputArg + 1]) : null;

const sql = fs.readFileSync(input, "utf8");
const { schemas, tables } = parseLegacyDump(sql);

const first = (row, keys) => keys.map((key) => row[key]).find((value) => value !== undefined);
const sha256 = (value) => crypto.createHash("sha256").update(String(value ?? ""), "utf8").digest("hex");
const toInt = (value) => (value == null || value === "" ? null : Number(value));

const posts = tables.get("wp_posts") ?? [];
const postmeta = tables.get("wp_postmeta") ?? [];
const terms = tables.get("wp_terms") ?? [];
const taxonomyRows = tables.get("wp_term_taxonomy") ?? [];
const relationships = tables.get("wp_term_relationships") ?? [];

const safeMetaPattern = /^(location_|tour_|accommodation_|car_rental_|room_type_|review_)/;
const safeExactMeta = new Set([
  "_thumbnail_id",
  "_wp_attached_file",
  "_wp_attachment_metadata",
  "_slide_link_url",
  "_sequence_slider_id",
  "_menu_item_object_id",
  "_menu_item_menu_item_parent",
  "_menu_item_type",
  "_menu_item_url",
  "_menu_item_object",
  "_menu_item_target",
  "_menu_item_classes",
  "_menu_item_xfn",
]);
const unsafeMetaPattern = /(?:email|phone|address|password|token|secret|special_requirements)/i;

const metaByPost = new Map();
for (const row of postmeta) {
  const postId = first(row, ["post_id"]);
  const key = first(row, ["meta_key"]);
  const value = first(row, ["meta_value"]);
  if (postId == null || key == null) continue;
  if (!(safeMetaPattern.test(String(key)) || safeExactMeta.has(String(key))) || unsafeMetaPattern.test(String(key))) continue;
  const items = metaByPost.get(String(postId)) ?? [];
  items.push({ key: String(key), value: value == null ? null : String(value) });
  metaByPost.set(String(postId), items);
}

const postRecords = posts
  .filter((row) => first(row, ["post_type"])
    && !["revision", "nav_menu_item", "acf", "wpcf7_contact_form"].includes(String(first(row, ["post_type"]))))
  .map((row) => {
    const id = toInt(first(row, ["ID", "id", "Id"]));
    const content = first(row, ["post_content"]);
    const excerpt = first(row, ["post_excerpt"]);
    return {
      id,
      type: String(first(row, ["post_type"])),
      status: String(first(row, ["post_status"])),
      slug: String(first(row, ["post_name"]) ?? ""),
      title: String(first(row, ["post_title"]) ?? ""),
      date: String(first(row, ["post_date"]) ?? ""),
      modified: String(first(row, ["post_modified"]) ?? ""),
      parentId: toInt(first(row, ["post_parent"])),
      menuOrder: toInt(first(row, ["menu_order"])),
      content: { chars: String(content ?? "").length, sha256: sha256(content ?? "") },
      excerpt: { chars: String(excerpt ?? "").length, sha256: sha256(excerpt ?? "") },
      customerFacingMeta: (metaByPost.get(String(id)) ?? []).sort((a, b) => a.key.localeCompare(b.key)),
    };
  });

const taxonomyById = new Map(taxonomyRows.map((row) => [String(first(row, ["term_taxonomy_id"])), row]));
const termById = new Map(terms.map((row) => [String(first(row, ["term_id"])), row]));

const taxonomy = taxonomyRows.map((row) => ({
  termTaxonomyId: toInt(first(row, ["term_taxonomy_id"])),
  termId: toInt(first(row, ["term_id"])),
  taxonomy: String(first(row, ["taxonomy"]) ?? ""),
  parentTermId: toInt(first(row, ["parent"])),
  count: toInt(first(row, ["count"])),
  term: (() => {
    const term = termById.get(String(first(row, ["term_id"])));
    return term ? { name: String(first(term, ["name"]) ?? ""), slug: String(first(term, ["slug"]) ?? "") } : null;
  })(),
})).sort((a, b) => `${a.taxonomy}:${a.term?.slug ?? ""}`.localeCompare(`${b.taxonomy}:${b.term?.slug ?? ""}`));

const postTerms = relationships.map((row) => {
  const objectId = toInt(first(row, ["object_id"]));
  const termTaxonomyId = String(first(row, ["term_taxonomy_id"]));
  const tax = taxonomyById.get(termTaxonomyId);
  const term = tax ? termById.get(String(first(tax, ["term_id"]))) : null;
  return {
    postId: objectId,
    termTaxonomyId: toInt(termTaxonomyId),
    termOrder: toInt(first(row, ["term_order"])),
    taxonomy: tax ? String(first(tax, ["taxonomy"]) ?? "") : null,
    term: term ? { id: toInt(first(tax, ["term_id"])), name: String(first(term, ["name"]) ?? ""), slug: String(first(term, ["slug"]) ?? "") } : null,
  };
});

const schedule = (tables.get("wp_byt_tour_schedule") ?? []).map((row) => ({
  id: toInt(first(row, ["Id", "id"])),
  tourId: toInt(first(row, ["tour_id"])),
  startDate: String(first(row, ["start_date"]) ?? ""),
  price: first(row, ["price"]),
  durationDays: toInt(first(row, ["duration_days"])),
  maxPeople: toInt(first(row, ["max_people"])),
}));

const media = posts
  .filter((row) => String(first(row, ["post_type"]) ?? "") === "attachment")
  .map((row) => {
    const id = String(first(row, ["ID", "id", "Id"]));
    const meta = metaByPost.get(id) ?? [];
    const byKey = Object.fromEntries(meta.map((item) => [item.key, item.value]));
    return {
      id: toInt(id),
      slug: String(first(row, ["post_name"]) ?? ""),
      title: String(first(row, ["post_title"]) ?? ""),
      date: String(first(row, ["post_date"]) ?? ""),
      attachedFile: byKey._wp_attached_file ?? null,
      thumbnailMetadataPresent: Boolean(byKey._wp_attachment_metadata),
    };
  });

const currencies = (tables.get("wp_byt_currencies") ?? []).map((row) => ({
  code: String(first(row, ["currency_code"]) ?? ""),
  label: String(first(row, ["currency_label"]) ?? ""),
  symbol: String(first(row, ["currency_symbol"]) ?? ""),
}));

const relevantTypes = ["location", "tour", "accommodation", "car_rental", "room_type", "review"];
const publishedByType = Object.fromEntries(relevantTypes.map((type) => [type, postRecords.filter((row) => row.type === type && row.status === "publish").length]));

const inventory = {
  generatedAt: new Date().toISOString(),
  source: "haibt163/travel:data_vietaustravel",
  safety: {
    rawRecordSamples: false,
    piiExported: false,
    credentialsImported: false,
    customerBookingRowsExported: false,
  },
  summary: {
    tableCount: schemas.size,
    populatedTableCount: [...tables.values()].filter((rows) => rows.length > 0).length,
    postCount: posts.length,
    publishableContentCount: postRecords.filter((row) => row.status === "publish").length,
    publishedByType,
    mediaCount: media.length,
    taxonomyCount: taxonomy.length,
    relationshipCount: postTerms.length,
    tourScheduleCount: schedule.length,
    currencyCount: currencies.length,
  },
  postRecords,
  media,
  taxonomy,
  postTerms,
  tourSchedule: schedule,
  currencies,
  structuredCounts: {
    wp_byt_bookings: (tables.get("wp_byt_bookings") ?? []).length,
    wp_byt_car_rental_bookings: (tables.get("wp_byt_car_rental_bookings") ?? []).length,
    wp_byt_car_rental_booking_days: (tables.get("wp_byt_car_rental_booking_days") ?? []).length,
    wp_byt_tour_booking: (tables.get("wp_byt_tour_booking") ?? []).length,
    wp_byt_vacancies: (tables.get("wp_byt_vacancies") ?? []).length,
    wp_byt_vacancy_bookings: (tables.get("wp_byt_vacancy_bookings") ?? []).length,
  },
};

const text = `${JSON.stringify(inventory, null, 2)}\n`;
if (output) {
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, text);
} else {
  process.stdout.write(text);
}
