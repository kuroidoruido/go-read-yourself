export class RainbowColor {
  #red: number = 0;
  #green: number = 0;
  #blue: number = 0;
  #alpha: number = 1;

  constructor(
    red: number = 0,
    green: number = 0,
    blue: number = 0,
    alpha: number = 1
  ) {
    this.red = red;
    this.green = green;
    this.blue = blue;
    this.alpha = alpha;
  }

  public get red() {
    return this.#red;
  }
  public set red(n: number) {
    if (n < 0 || 255 < n) {
      throw new Error("Invalid red value");
    }
    this.#red = n;
  }

  public get green() {
    return this.#green;
  }
  public set green(n: number) {
    if (n < 0 || 255 < n) {
      throw new Error("Invalid green value");
    }
    this.#green = n;
  }

  public get blue() {
    return this.#blue;
  }
  public set blue(n: number) {
    if (n < 0 || 255 < n) {
      throw new Error("Invalid blue value");
    }
    this.#blue = n;
  }

  public get alpha() {
    return this.#alpha;
  }
  public set alpha(n: number) {
    if (n < 0 || 1 < n) {
      throw new Error("Invalid alpha value");
    }
    this.#alpha = n;
  }

  public toHex() {
    return `#${b64(this.red)}${b64(this.green)}${b64(this.blue)}`;
  }

  public toRgb() {
    return `rgb(${this.red},${this.green},${this.blue})`;
  }

  public toHexWithAlpha() {
    return `#${b64(this.red)}${b64(this.green)}${b64(this.blue)}${b64(
      Math.ceil(this.alpha * 255)
    )}`;
  }

  public toRgba() {
    return `rgba(${this.red},${this.green},${this.blue},${this.alpha})`;
  }

  public toString() {
    return this.toRgba();
  }

  public static generate(size: number): RainbowColor[] {
    if (size == undefined || size < 0) {
      throw new Error("Invalid rainbow size");
    }
    if (size === 0) {
      return [];
    }
    const frequency = 6 / size;
    return new Array(size)
      .fill(null)
      .map(
        (_, index) =>
          new RainbowColor(
            Math.ceil(Math.sin(frequency * (index - 1) + 0) * 127 + 128),
            Math.ceil(Math.sin(frequency * (index - 1) + 1) * 127 + 128),
            Math.ceil(Math.sin(frequency * (index - 1) + 3) * 127 + 128)
          )
      );
  }
}

function b64(n: number = 0): string {
  const res = n.toString(16).toUpperCase();
  return res.length === 2 ? res : "0" + res;
}
