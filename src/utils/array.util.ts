export function dedup<T>(array: T[]): T[] {
  return [...new Set(array)];
}
