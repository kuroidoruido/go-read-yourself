export function isDefined<T>(x: T | undefined | null): x is T {
  return x !== null && typeof x !== "undefined";
}

export function isNotDefined<T>(
  x: T | undefined | null
): x is undefined | null {
  return x === null || typeof x === "undefined";
}

export function isEmpty<T extends { length: number }>(x: T): boolean {
  return x.length === 0;
}

export function isNotEmpty<T extends { length: number }>(x: T): boolean {
  return x.length > 0;
}

export function isNotBlank<T extends { length: number; trim(): T }>(
  x: T
): boolean {
  return isNotEmpty(x.trim());
}

export function isNotDefinedOrEmpty<T extends { length: number }>(
  x: T | undefined | null
): x is undefined | null {
  return isNotDefined(x) || isEmpty(x);
}

export function isDefinedAndNotEmpty<T extends { length: number }>(
  x: T | undefined | null
) {
  return isDefined(x) && isNotEmpty(x);
}
