import test from "node:test";
import assert from "node:assert/strict";
import { auditLegacyDump } from "./audit-legacy-dump.mjs";

const fixture = `CREATE TABLE \`wp_posts\` (\n \`ID\` bigint(20),\n \`post_type\` varchar(20),\n \`post_status\` varchar(20),\n \`post_title\` text\n) ENGINE=MyISAM;\nCREATE TABLE \`wp_postmeta\` (\n \`meta_id\` bigint(20),\n \`post_id\` bigint(20),\n \`meta_key\` varchar(255),\n \`meta_value\` longtext\n) ENGINE=MyISAM;\nCREATE TABLE \`wp_byt_tour_schedule\` (\n \`Id\` bigint(20),\n \`tour_id\` bigint(20)\n) ENGINE=MyISAM;\nINSERT INTO \`wp_posts\` VALUES (1,'location','publish','Hanoi'),(2,'tour','draft','Chef\\'s route');\nINSERT INTO \`wp_postmeta\` VALUES (1,1,'image','url,with,commas'),(2,1,'price',NULL);\nINSERT INTO \`wp_byt_tour_schedule\` VALUES (10,611),(11,630);`;

test("legacy dump audit parses schemas and row counts without exporting records", () => {
  const report = auditLegacyDump(fixture);
  assert.equal(report.tables.wp_posts.rows, 2);
  assert.equal(report.tables.wp_postmeta.rows, 2);
  assert.equal(report.tables.wp_byt_tour_schedule.rows, 2);
  assert.deepEqual(report.wpPosts.byPostType, { location: 1, tour: 1 });
  assert.deepEqual(report.wpPosts.byStatus, { publish: 1, draft: 1 });
  assert.deepEqual(report.wpPostmeta.byKey, { image: 1, price: 1 });
  assert.equal(report.safety.piiExported, false);
  assert.equal(report.safety.credentialsImported, false);
});
