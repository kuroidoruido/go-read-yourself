export function isDefined<T>(x: T | undefined | null): x is T {
  return x !== null && typeof x !== "undefined";
}

export function isNotDefined<T>(
  x: T | undefined | null
): x is undefined | null {
  return x === null || typeof x === "undefined";
}

export function isNotDefinedOrEmpty<T extends { length: number }>(
  x: T | undefined | null
): x is undefined | null {
  return isNotDefined(x) || x.length === 0;
}

export function isDefinedAndNotEmpty<T extends { length: number }>(
  x: T | undefined | null
) {
  return isDefined(x) && x.length > 0;
}
