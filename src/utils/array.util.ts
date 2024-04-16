export function dedup<T>(array: T[]): T[] {
  return [...new Set(array)];
}

export function sortAlphaAsc<T = string>(
  project: (x: T) => string = (x) => x as string
) {
  return (a: T, b: T) =>
    project(a)
      .toLocaleLowerCase()
      .localeCompare(project(b).toLocaleLowerCase());
}
