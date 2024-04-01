import { describe, expect, it } from "vitest";
import {
  extractYoutubeVideoId,
  getThumbnailLink,
  isYoutubeLink,
} from "./post.util";

describe(isYoutubeLink.name, () => {
  it.each([
    "https://www.youtube.com/watch?v=jebqxDgDn2g",
    "https://youtu.be/jebqxDgDn2g",
    "https://youtu.be/jebqxDgDn2g?si=A3vlKNlNU9LNGZOz",
    "https://www.youtube.com/shorts/BXsw6nNxj7k",
    "https://youtube.com/shorts/BXsw6nNxj7k",
    "https://youtube.com/shorts/BXsw6nNxj7k?si=nANNazQtveqFvIBb",
  ])('should return true for youtube link "%s"', (url: string) => {
    expect(isYoutubeLink(url)).toBeTruthy();
  });
  it.each([null, undefined, "", "http://example.com"])(
    "should return false for not youtube link",
    (url: string | undefined | null) => {
      expect(isYoutubeLink(url)).toBeFalsy();
    }
  );
});

describe(extractYoutubeVideoId.name, () => {
  it("should extract id from long url", () => {
    expect(
      extractYoutubeVideoId("https://www.youtube.com/watch?v=jebqxDgDn2g")
    ).toBe("jebqxDgDn2g");
  });
  it("should extract id from long share url", () => {
    expect(extractYoutubeVideoId("https://youtu.be/jebqxDgDn2g")).toBe(
      "jebqxDgDn2g"
    );
  });
  it("should extract id from long share url with params", () => {
    expect(
      extractYoutubeVideoId("https://youtu.be/jebqxDgDn2g?si=A3vlKNlNU9LNGZOz")
    ).toBe("jebqxDgDn2g");
  });
  it("should extract id from short url", () => {
    expect(
      extractYoutubeVideoId("https://www.youtube.com/shorts/BXsw6nNxj7k")
    ).toBe("BXsw6nNxj7k");
  });
  it("should extract id from short share url", () => {
    expect(
      extractYoutubeVideoId("https://youtube.com/shorts/BXsw6nNxj7k")
    ).toBe("BXsw6nNxj7k");
  });
  it("should extract id from short share url with params", () => {
    expect(
      extractYoutubeVideoId(
        "https://youtube.com/shorts/BXsw6nNxj7k?si=nANNazQtveqFvIBb"
      )
    ).toBe("BXsw6nNxj7k");
  });
  it.each([null, undefined, "", "http://example.com"])(
    'should return null from non youtube links "%s" ',
    (input: string | null | undefined) => {
      expect(extractYoutubeVideoId(input)).toBeNull();
    }
  );
});

describe(getThumbnailLink.name, () => {
  it("should generate a correct thumbnail link", () => {
    expect(getThumbnailLink("jebqxDgDn2g")).toBe(
      "https://i.ytimg.com/vi/jebqxDgDn2g/hq720.jpg"
    );
  });
});
