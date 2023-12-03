import type { APIRoute } from "astro";
import { JSDOM } from "jsdom";
import { dedup } from "../utils/array.util";
import { isDefined } from "../utils/fp.util";

export const GET: APIRoute = async ({ request }) => {
  const decodedUrl = new URL(request.url);
  const url = decodedUrl.searchParams.get("url");
  if (!url || url.length === 0) {
    return { status: 400, body: "" };
  }
  const titles = await extractTitles(url);
  console.log({ titles });

  return {
    body: JSON.stringify({
      titles,
    }),
  };
};

async function extractTitles(url: string): Promise<string[]> {
  const titles: (string | undefined | null)[] = [];

  const page = await fetch(url).then((res) => res.text());
  const dom = new JSDOM(page);
  const pageTitle = dom.window.document.querySelector("title")?.textContent;
  titles.push(pageTitle);
  dom.window.document.querySelectorAll("h1").forEach((h1) => {
    titles.push(h1.textContent);
  });
  dom.window.document.querySelectorAll("h2").forEach((h2) => {
    titles.push(h2.textContent);
  });

  return dedup(titles.filter(isDefined).map((t) => t?.trim()));
}
