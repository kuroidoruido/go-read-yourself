import { isDefined, isNotDefined } from "./fp.util";

export function hideSensibleData(
  obj: any,
  keyPatterns = [/pass/, /token/, /salt/, /apikey/]
) {
  if (typeof obj !== "object" || isNotDefined(obj)) {
    return obj;
  }

  return Object.fromEntries(
    Object.entries(obj).map(([key, val]): [any, any] => {
      if (typeof val === "object") {
        return [key, hideSensibleData(val!)];
      }
      if (keyPatterns.some((pattern) => isDefined(pattern.exec(key)))) {
        return [key, replaceKeyWithStars(deepCopy(val))];
      }
      return [key, val];
    })
  );
}

function replaceKeyWithStars(obj: any) {
  if (typeof obj === "object") {
    for (const key of Object.keys(obj)) {
      obj[key] = replaceKeyWithStars(obj[key]);
    }
    return obj;
  }
  const strObj = String(obj);
  const prefix = typeof obj === "string" ? "" : `<${typeof obj}>`;
  return (
    prefix +
    strObj.slice(0, strObj.length <= 5 ? 1 : 2) +
    new Array(Math.max(5, strObj.length - 2)).fill("*").join("")
  );
}

function deepCopy(obj: any) {
  return JSON.parse(JSON.stringify(obj));
}
