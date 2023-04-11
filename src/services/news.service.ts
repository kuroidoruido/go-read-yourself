import { cp, writeFileSync } from "node:fs";
import NEWS from "../../data/news.json";
import { dedup } from "../utils/array.util";

class NewsServiceImpl {
  getNews() {
    return NEWS;
  }

  getTags() {
    const tags = dedup(NEWS.news.flatMap((n) => n.tags));
    tags.sort((a, b) =>
      a.toLocaleLowerCase().localeCompare(b.toLocaleLowerCase())
    );
    return tags;
  }

  addPost(newsEntry: NewsEntry) {
    console.log("NewsServiceImpl.addPost", { newsEntry });
    writeFileSync(
      "./data/news.json",
      JSON.stringify({ ...NEWS, news: [newsEntry, ...NEWS.news] }, undefined, 2)
    );
  }
}

export const NewsService = new NewsServiceImpl();
