import { describe, expect, it } from "vitest";
import { RainbowColor } from "./rainbow.util";

describe(RainbowColor.name, () => {
  describe("constructor", () => {
    it("should default correctly", () => {
      expect(new RainbowColor()).toEqual(new RainbowColor(0, 0, 0, 1));
    });
    it("should be able to omit the alpha", () => {
      expect(new RainbowColor(123, 234, 231)).toEqual(
        new RainbowColor(123, 234, 231, 1)
      );
    });
    describe("should reject invalid color value", () => {
      it.each([
        [[-1, 1, 1, 1], "Invalid red value"],
        [[256, 1, 1, 1], "Invalid red value"],
        [[1, -1, 1, 1], "Invalid green value"],
        [[1, 256, 1, 1], "Invalid green value"],
        [[1, 1, -1, 1], "Invalid blue value"],
        [[1, 1, 256, 1], "Invalid blue value"],
        [[1, 1, 1, -0.1], "Invalid alpha value"],
        [[1, 1, 1, -1], "Invalid alpha value"],
        [[1, 1, 1, 1.01], "Invalid alpha value"],
        [[1, 1, 1, 2], "Invalid alpha value"],
      ] as [[number, number, number, number], string][])(
        "%s => %s",
        (colors: [number, number, number, number], error: string) => {
          expect(() => new RainbowColor(...colors)).toThrowError(
            new Error(error)
          );
        }
      );
    });
  });
  describe(RainbowColor.generate.name, () => {
    it("should correctly generate rainbow of size -1", () => {
      expect(() => RainbowColor.generate(-1)).toThrowError(
        new Error("Invalid rainbow size")
      );
    });
    it("should correctly generate rainbow of size 0", () => {
      expect(RainbowColor.generate(0)).toEqual([]);
    });
    it("should correctly generate rainbow of size 1", () => {
      expect(RainbowColor.generate(1)).toEqual([
        new RainbowColor(128, 234, 145, 1),
      ]);
    });
    it("should correctly generate rainbow of size 2", () => {
      expect(RainbowColor.generate(2)).toEqual([
        new RainbowColor(128, 234, 145, 1),
        new RainbowColor(145, 31, 92, 1),
      ]);
    });
    it("should correctly generate rainbow of size 3", () => {
      expect(RainbowColor.generate(3)).toEqual([
        new RainbowColor(128, 234, 145, 1),
        new RainbowColor(243, 145, 6, 1),
        new RainbowColor(31, 6, 211, 1),
      ]);
    });
    it("should correctly generate rainbow of size 5", () => {
      expect(RainbowColor.generate(5)).toEqual([
        new RainbowColor(128, 234, 145, 1),
        new RainbowColor(246, 230, 17, 1),
        new RainbowColor(213, 95, 29, 1),
        new RainbowColor(71, 1, 167, 1),
        new RainbowColor(1, 68, 254, 1),
      ]);
    });
    it("should correctly generate rainbow of size 10", () => {
      expect(RainbowColor.generate(10)).toEqual([
        new RainbowColor(128, 234, 145, 1),
        new RainbowColor(199, 254, 71, 1),
        new RainbowColor(246, 230, 17, 1),
        new RainbowColor(251, 170, 1, 1),
        new RainbowColor(213, 95, 29, 1),
        new RainbowColor(145, 31, 92, 1),
        new RainbowColor(71, 1, 167, 1),
        new RainbowColor(17, 15, 228, 1),
        new RainbowColor(1, 68, 254, 1),
        new RainbowColor(29, 142, 236, 1),
      ]);
    });
    it("should correctly generate rainbow of size 15", () => {
      expect(RainbowColor.generate(15)).toEqual([
        new RainbowColor(128, 234, 145, 1),
        new RainbowColor(177, 253, 95, 1),
        new RainbowColor(219, 251, 50, 1),
        new RainbowColor(246, 230, 17, 1),
        new RainbowColor(254, 193, 1, 1),
        new RainbowColor(243, 145, 6, 1),
        new RainbowColor(213, 95, 29, 1),
        new RainbowColor(170, 50, 68, 1),
        new RainbowColor(120, 17, 117, 1),
        new RainbowColor(71, 1, 167, 1),
        new RainbowColor(31, 6, 211, 1),
        new RainbowColor(7, 29, 242, 1),
        new RainbowColor(1, 68, 254, 1),
        new RainbowColor(15, 117, 247, 1),
        new RainbowColor(47, 167, 221, 1),
      ]);
    });
  });

  describe(RainbowColor.prototype.toHex.name, () => {
    it.each([
      [new RainbowColor(128, 234, 145, 1), "#80EA91"],
      [new RainbowColor(177, 253, 95, 1), "#B1FD5F"],
      [new RainbowColor(219, 251, 50, 1), "#DBFB32"],
      [new RainbowColor(246, 230, 17, 1), "#F6E611"],
      [new RainbowColor(254, 193, 1, 1), "#FEC101"],
      [new RainbowColor(243, 145, 6, 1), "#F39106"],
      [new RainbowColor(213, 95, 29, 1), "#D55F1D"],
      [new RainbowColor(170, 50, 68, 1), "#AA3244"],
      [new RainbowColor(120, 17, 117, 1), "#781175"],
      [new RainbowColor(71, 1, 167, 1), "#4701A7"],
      [new RainbowColor(31, 6, 211, 1), "#1F06D3"],
      [new RainbowColor(7, 29, 242, 1), "#071DF2"],
      [new RainbowColor(1, 68, 254, 1), "#0144FE"],
      [new RainbowColor(15, 117, 247, 1), "#0F75F7"],
      [new RainbowColor(47, 167, 221, 1), "#2FA7DD"],
    ])(
      "should convert correctly %o => %s",
      (color: RainbowColor, expectedHexColor: string) => {
        expect(color.toHex()).toEqual(expectedHexColor);
      }
    );
  });

  describe(RainbowColor.prototype.toHexWithAlpha.name, () => {
    it.each([
      [new RainbowColor(128, 234, 145, 0), "#80EA9100"],
      [new RainbowColor(177, 253, 95, 0.01), "#B1FD5F03"],
      [new RainbowColor(219, 251, 50, 0.1), "#DBFB321A"],
      [new RainbowColor(246, 230, 17, 0.125), "#F6E61120"],
      [new RainbowColor(254, 193, 1, 0.25), "#FEC10140"],
      [new RainbowColor(243, 145, 6, 0.33), "#F3910655"],
      [new RainbowColor(213, 95, 29, 0.5), "#D55F1D80"],
      [new RainbowColor(170, 50, 68, 0.66), "#AA3244A9"],
      [new RainbowColor(120, 17, 117, 0.75), "#781175C0"],
      [new RainbowColor(71, 1, 167, 0.9), "#4701A7E6"],
      [new RainbowColor(31, 6, 211, 0.99), "#1F06D3FD"],
      [new RainbowColor(7, 29, 242, 0.999), "#071DF2FF"],
      [new RainbowColor(1, 68, 254, 0.9999), "#0144FEFF"],
      [new RainbowColor(15, 117, 247, 0.9999), "#0F75F7FF"],
      [new RainbowColor(47, 167, 221, 1), "#2FA7DDFF"],
    ])(
      "should convert correctly %o => %s",
      (color: RainbowColor, expectedHexColor: string) => {
        expect(color.toHexWithAlpha()).toEqual(expectedHexColor);
      }
    );
  });

  describe(RainbowColor.prototype.toRgb.name, () => {
    it.each([
      [new RainbowColor(128, 234, 145, 0), "rgb(128,234,145)"],
      [new RainbowColor(177, 253, 95, 0.01), "rgb(177,253,95)"],
      [new RainbowColor(219, 251, 50, 0.1), "rgb(219,251,50)"],
      [new RainbowColor(246, 230, 17, 0.125), "rgb(246,230,17)"],
      [new RainbowColor(254, 193, 1, 0.25), "rgb(254,193,1)"],
      [new RainbowColor(243, 145, 6, 0.33), "rgb(243,145,6)"],
      [new RainbowColor(213, 95, 29, 0.5), "rgb(213,95,29)"],
      [new RainbowColor(170, 50, 68, 0.66), "rgb(170,50,68)"],
      [new RainbowColor(120, 17, 117, 0.75), "rgb(120,17,117)"],
      [new RainbowColor(71, 1, 167, 0.9), "rgb(71,1,167)"],
      [new RainbowColor(31, 6, 211, 0.99), "rgb(31,6,211)"],
      [new RainbowColor(7, 29, 242, 0.999), "rgb(7,29,242)"],
      [new RainbowColor(1, 68, 254, 0.9999), "rgb(1,68,254)"],
      [new RainbowColor(15, 117, 247, 0.9999), "rgb(15,117,247)"],
      [new RainbowColor(47, 167, 221, 1), "rgb(47,167,221)"],
    ])(
      "should convert correctly %o => %s",
      (color: RainbowColor, expectedHexColor: string) => {
        expect(color.toRgb()).toEqual(expectedHexColor);
      }
    );
  });

  describe(RainbowColor.prototype.toRgba.name, () => {
    it.each([
      [new RainbowColor(128, 234, 145, 0), "rgba(128,234,145,0)"],
      [new RainbowColor(177, 253, 95, 0.01), "rgba(177,253,95,0.01)"],
      [new RainbowColor(219, 251, 50, 0.1), "rgba(219,251,50,0.1)"],
      [new RainbowColor(246, 230, 17, 0.125), "rgba(246,230,17,0.125)"],
      [new RainbowColor(254, 193, 1, 0.25), "rgba(254,193,1,0.25)"],
      [new RainbowColor(243, 145, 6, 0.33), "rgba(243,145,6,0.33)"],
      [new RainbowColor(213, 95, 29, 0.5), "rgba(213,95,29,0.5)"],
      [new RainbowColor(170, 50, 68, 0.66), "rgba(170,50,68,0.66)"],
      [new RainbowColor(120, 17, 117, 0.75), "rgba(120,17,117,0.75)"],
      [new RainbowColor(71, 1, 167, 0.9), "rgba(71,1,167,0.9)"],
      [new RainbowColor(31, 6, 211, 0.99), "rgba(31,6,211,0.99)"],
      [new RainbowColor(7, 29, 242, 0.999), "rgba(7,29,242,0.999)"],
      [new RainbowColor(1, 68, 254, 0.9999), "rgba(1,68,254,0.9999)"],
      [new RainbowColor(15, 117, 247, 0.9999), "rgba(15,117,247,0.9999)"],
      [new RainbowColor(47, 167, 221, 1), "rgba(47,167,221,1)"],
    ])(
      "should convert correctly %o => %s",
      (color: RainbowColor, expectedHexColor: string) => {
        expect(color.toRgba()).toEqual(expectedHexColor);
      }
    );
  });
});
