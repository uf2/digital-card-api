/** Groups rows by key and returns the groups in the order of the given keys. */
export function groupByKeys<K, T>(
  keys: readonly K[],
  rows: T[],
  keyOf: (row: T) => K,
): T[][] {
  const groups = Map.groupBy(rows, keyOf);
  return keys.map((key) => groups.get(key) ?? []);
}
