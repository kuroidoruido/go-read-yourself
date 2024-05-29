import type { APIRoute } from "astro";
import { JSDOM } from "jsdom";
import { dedup } from "../utils/array.util";
import { isDefined } from "../utils/fp.util";

export const GET: APIRoute = async ({ request }) => {
  const decodedUrl = new URL(request.url);
  const url = decodedUrl.searchParams.get("url");
  if (!url || url.length === 0) {
    return new Response("", { status: 400 });
  }
  const titles = await extractTitles(url);
  console.log({ titles });

  return new Response(JSON.stringify({ titles }), { status: 200 });
};

async function extractTitles(url: string): Promise<string[]> {
  const titles: (string | undefined | null)[] = [];

  const page = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (X11; Linux x86_64; rv:125.0) Gecko/20100101 Firefox/125.0",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    },
  }).then((res) => {
    console.log(res);
    return res.text();
  });
  const dom = new JSDOM(page);
  const pageTitle = dom.window.document.querySelector("title")?.textContent;
  titles.push(pageTitle);
  dom.window.document.querySelectorAll("h1").forEach((h1) => {
    titles.push(h1.textContent);
  });
  dom.window.document.querySelectorAll("h2").forEach((h2) => {
    titles.push(h2.textContent);
  });
  dom.window.document
    .querySelectorAll('meta[property="og:title"]')
    .forEach((meta) => {
      titles.push((meta as HTMLMetaElement).content);
    });
  dom.window.document
    .querySelectorAll('meta[property="twitter:creator"]')
    .forEach((meta) => {
      titles.push((meta as HTMLMetaElement).content);
    });
  dom.window.document
    .querySelectorAll('meta[property="og:description"]')
    .forEach((meta) => {
      titles.push((meta as HTMLMetaElement).content);
    });

  return dedup(titles.filter(isDefined).map((t) => t?.trim()));
}
