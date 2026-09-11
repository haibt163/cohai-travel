import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const sql = await readFile(new URL("../migrations/0006_provenance.sql", import.meta.url), "utf8");

const expectedSourceBackedDestinations = ["hanoi", "halong", "hoian", "hue", "sapa", "mekong", "phuquoc", "nhatrang"];
const expectedSourceBackedTours = ["junk-halong", "hue-hoian", "hanoi-heritage", "sapa-terraces", "mekong-slow", "phuquoc-drift", "central-coast"];

test("provenance migration defines the canonical state vocabulary", () => {
  assert.match(sql, /provenance_state text not null default 'synthetic-pending'/);
  assert.match(sql, /CHECK \(provenance_state in \('source-backed', 'modern-addition', 'synthetic-pending'\)\)/);
});

test("every source-backed destination has a source reference", () => {
  for (const id of expectedSourceBackedDestinations) {
    const normalized = new RegExp(`update destinations set source_ref = '[^']+', provenance_state = 'source-backed' where id = '${id}'`);
    assert.match(sql, normalized, `missing source-backed destination mapping for ${id}`);
  }
});

test("every source-backed journey has a source reference", () => {
  for (const id of expectedSourceBackedTours) {
    const normalized = new RegExp(`update tours set source_ref = '[^']+', provenance_state = 'source-backed' where id = '${id}'`);
    assert.match(sql, normalized, `missing source-backed journey mapping for ${id}`);
  }
});

test("intentional modern additions are not given legacy source references", () => {
  assert.match(sql, /update destinations set provenance_state = 'modern-addition' where id in \('siemreap', 'bangkok'\)/);
  assert.match(sql, /update tours set provenance_state = 'modern-addition' where id in \('angkor-dawn', 'puluong'\)/);
});
