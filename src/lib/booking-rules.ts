export function dateRangesOverlap(
  requestedStart: string,
  requestedNights: number,
  existingStart: string,
  existingNights: number,
): boolean {
  const requestedEnd = addDays(requestedStart, requestedNights);
  const existingEnd = addDays(existingStart, existingNights);
  return requestedStart < existingEnd && existingStart < requestedEnd;
}

export function inventoryAvailable(
  inventoryCount: number,
  confirmedUnits: number,
  requestedUnits = 1,
): boolean {
  return inventoryCount > 0 && requestedUnits > 0 && confirmedUnits + requestedUnits <= inventoryCount;
}

function addDays(date: string, days: number): string {
  const value = new Date(`${date}T00:00:00Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}
