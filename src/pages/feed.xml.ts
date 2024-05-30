import rss from "@astrojs/rss";
import { marked } from "marked";
import { NewsService } from "../services/news.service";

export function GET(context: any) {
  return rss({
    title: "Anthony Pena - revue de presse",
    description:
      "Les éléments qui captent le plus mon attention quand je fais ma veille.",
    site: context.site,
    items: NewsService.getNews().news.map((entry) => ({
      title: entry.title,
      link: entry.url,
      pubDate: new Date(entry.creationDate),
      content:
        entry.tags
          .filter((tag) => !tag.startsWith("."))
          .map((tag) => `<span>#${tag}</span>`)
          .join("&nbsp;") + marked.parse(entry.content),
    })),
    customData: `<language>fr-fr</language>`,
  });
}
