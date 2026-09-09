export function isMigrationFile(path) {
  return /^migrations\/\d+_[^/]+\.sql$/.test(path);
}

export function migrationName(path) {
  return path.split('/').at(-1)?.replace(/\.sql$/, '') ?? path;
}

export function pendingMigrations(paths, appliedNames) {
  const applied = new Set(appliedNames);
  return paths
    .filter(isMigrationFile)
    .map((path) => ({ name: migrationName(path), path }))
    .filter(({ name }) => !applied.has(name))
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
}
