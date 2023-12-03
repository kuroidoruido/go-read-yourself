import rss from "@astrojs/rss";
import { marked } from "marked";
import NEWS from "../../data/news.json";

export function GET(context: any) {
  return rss({
    title: "Anthony Pena - revue de presse",
    description:
      "Les éléments qui captent le plus mon attention quand je fais ma veille.",
    site: context.site,
    items: NEWS.news.map((entry) => ({
      title: entry.title,
      link: entry.url,
      pubDate: new Date(entry.creationDate),
      content:
        entry.tags.map((tag) => `<span>#${tag}</span>`).join("&nbsp;") +
        marked.parse(entry.content),
    })),
    customData: `<language>fr-fr</language>`,
  });
}
