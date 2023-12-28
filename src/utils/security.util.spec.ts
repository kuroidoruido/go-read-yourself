import { describe, expect, it } from "vitest";
import { hideSensibleData } from "./security.util";

describe(hideSensibleData.name, () => {
  it.each([
    ["foo", "foo"],
    [123456, 123456],
    [{}, {}],
    [undefined, undefined],
    [null, null],
    [{ foo: "bar" }, { foo: "bar" }],
    [
      { foo: "bar", pass: "this is a password" },
      { foo: "bar", pass: "th****************" },
    ],
    [
      { foo: "bar", salt: "this is a salt" },
      { foo: "bar", salt: "th************" },
    ],
    [
      { foo: "bar", pass: "this is a password", salt: "this is a salt" },
      { foo: "bar", pass: "th****************", salt: "th************" },
    ],
    [
      {
        foo: "bar",
        sub: { pass: "this is a password" },
        salt: "this is a salt",
      },
      {
        foo: "bar",
        sub: { pass: "th****************" },
        salt: "th************",
      },
    ],
    [
      {
        foo: "bar",
        sub: { subsub: { pass: "this is a password" }, apikey: "something" },
        salt: "this is a salt",
      },
      {
        foo: "bar",
        sub: { subsub: { pass: "th****************" }, apikey: "so*******" },
        salt: "th************",
      },
    ],
    [
      { foo: "bar", pass: 123456789 },
      { foo: "bar", pass: "<number>12*******" },
    ],
    [
      { foo: "bar", pass: 1, token: "ab" },
      { foo: "bar", pass: "<number>1*****", token: "a*****" },
    ],
  ])("should when needed: %s => %s", (input, output) => {
    expect(hideSensibleData(input)).toEqual(output);
  });
});
