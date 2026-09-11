#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

function splitTopLevel(input, delimiter = ",") {
  const out = []; let start = 0; let depth = 0; let quote = null;
  for (let i = 0; i < input.length; i += 1) {
    const ch = input[i];
    if (quote) { if (ch === "\\") { i += 1; continue; } if (ch === quote) { if (input[i + 1] === quote) i += 1; else quote = null; } continue; }
    if (ch === "'" || ch === '"' || ch === "`") { quote = ch; continue; }
    if (ch === "(") depth += 1; else if (ch === ")") depth -= 1; else if (ch === delimiter && depth === 0) { out.push(input.slice(start, i).trim()); start = i + 1; }
  }
  out.push(input.slice(start).trim());
  return out.filter(Boolean);
}

function parseTuples(valuesText) {
  const tuples = []; let start = -1; let depth = 0; let quote = null;
  for (let i = 0; i < valuesText.length; i += 1) {
    const ch = valuesText[i];
    if (quote) { if (ch === "\\") { i += 1; continue; } if (ch === quote) { if (valuesText[i + 1] === quote) i += 1; else quote = null; } continue; }
    if (ch === "'") { quote = ch; continue; }
    if (ch === "(") { if (depth === 0) start = i + 1; depth += 1; }
    else if (ch === ")") { depth -= 1; if (depth === 0 && start >= 0) { tuples.push(splitTopLevel(valuesText.slice(start, i))); start = -1; } }
  }
  return tuples;
}

function parseScalar(token) {
  const s = token.trim(); if (/^null$/i.test(s)) return null;
  if (s.startsWith("'") && s.endsWith("'")) return s.slice(1, -1).replace(/\\([\\'"nrt])/g, (_, c) => c === "n" ? "\n" : c === "r" ? "\r" : c === "t" ? "\t" : c);
  if (/^-?\d+(?:\.\d+)?$/.test(s)) return Number(s);
  return s;
}

function readSchemas(sql) {
  const schemas = new Map();
  const re = /CREATE TABLE(?: IF NOT EXISTS)?\s+`?([A-Za-z0-9_]+)`?\s*\(([\s\S]*?)\)\s*(?:ENGINE\b|;)/gi;
  for (const match of sql.matchAll(re)) {
    const columns = [];
    for (const line of match[2].split(/\r?\n/)) { const m = line.match(/^\s*`([^`]+)`\s+/); if (m) columns.push(m[1]); }
    schemas.set(match[1], columns);
  }
  return schemas;
}

function readInserts(sql, schemas) {
  const tables = new Map();
  const re = /INSERT INTO\s+`?([A-Za-z0-9_]+)`?(?:\s*\(([^)]*)\))?\s+VALUES\s*/gi;
  for (const match of sql.matchAll(re)) {
    const valuesStart = (match.index ?? 0) + match[0].length; let end = valuesStart; let quote = null; let depth = 0;
    for (; end < sql.length; end += 1) { const ch = sql[end]; if (quote) { if (ch === "\\") { end += 1; continue; } if (ch === quote) { if (sql[end + 1] === quote) end += 1; else quote = null; } continue; } if (ch === "'") { quote = ch; continue; } if (ch === "(") depth += 1; else if (ch === ")") depth -= 1; else if (ch === ";" && depth === 0) break; }
    const columns = match[2] ? splitTopLevel(match[2]).map((x) => x.replace(/`/g, "").trim()) : schemas.get(match[1]) ?? [];
    const tuples = parseTuples(sql.slice(valuesStart, end)); const rows = tables.get(match[1]) ?? [];
    for (const tuple of tuples) { const values = tuple.map(parseScalar); const row = {}; for (let i = 0; i < columns.length; i += 1) row[columns[i]] = values[i]; rows.push(row); }
    tables.set(match[1], rows);
  }
  return tables;
}

export function parseLegacyDump(sql) {
  return { schemas: readSchemas(sql), tables: readInserts(sql, readSchemas(sql)) };
}

function histogram(rows, key) { const out = {}; for (const row of rows) { const value = row[key] ?? "<null>"; out[String(value)] = (out[String(value)] ?? 0) + 1; } return out; }

export function auditLegacyDump(sql) {
  const { schemas, tables } = parseLegacyDump(sql); const rowCounts = {};
  for (const [name, rows] of tables) rowCounts[name] = rows.length;
  const posts = tables.get("wp_posts") ?? []; const postmeta = tables.get("wp_postmeta") ?? [];
  return { generatedAt: new Date().toISOString(), source: "haibt163/travel:data_vietaustravel", safety: { rawRecordSamples: false, piiExported: false, credentialsImported: false }, tables: Object.fromEntries([...schemas.keys()].sort().map((name) => [name, { columns: schemas.get(name)?.length ?? 0, rows: rowCounts[name] ?? 0 }])), populatedTables: Object.fromEntries(Object.entries(rowCounts).filter(([, count]) => count > 0).sort(([a], [b]) => a.localeCompare(b))), wpPosts: { rows: posts.length, byPostType: histogram(posts, "post_type"), byStatus: histogram(posts, "post_status") }, wpPostmeta: { rows: postmeta.length, byKey: histogram(postmeta, "meta_key") }, structured: Object.fromEntries(["wp_byt_tour_schedule", "wp_byt_vacancies", "wp_byt_vacancy_bookings", "wp_byt_tour_booking", "wp_byt_bookings", "wp_byt_car_rental_bookings", "wp_byt_car_rental_booking_days"].map((name) => [name, rowCounts[name] ?? 0])) };
}

function usage() { console.error("Usage: node scripts/audit-legacy-dump.mjs --input /path/to/data_vietaustravel [--output report.json]"); process.exit(2); }
if (import.meta.url === `file://${process.argv[1]}`) { const args = process.argv.slice(2); const idx = args.indexOf("--input"); if (idx < 0 || !args[idx + 1]) usage(); const input = path.resolve(args[idx + 1]); const outputIdx = args.indexOf("--output"); const output = outputIdx >= 0 && args[outputIdx + 1] ? path.resolve(args[outputIdx + 1]) : null; const report = auditLegacyDump(fs.readFileSync(input, "utf8")); const text = `${JSON.stringify(report, null, 2)}\n`; if (output) { fs.mkdirSync(path.dirname(output), { recursive: true }); fs.writeFileSync(output, text); } else process.stdout.write(text); }
