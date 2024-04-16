import { isNotDefinedOrEmpty } from "./fp.util";

export function capitalizeFirst(s: string) {
  if (isNotDefinedOrEmpty(s)) {
    return s;
  }
  return s.slice(0, 1).toLocaleUpperCase() + s.slice(1);
}
