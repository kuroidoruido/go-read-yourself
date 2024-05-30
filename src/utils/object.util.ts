export function deepClone<T>(x: T): T {
  return JSON.parse(JSON.stringify(x));
}
