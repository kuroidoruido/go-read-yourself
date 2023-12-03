import { readFileSync, writeFileSync } from "node:fs";
import { dedup } from "../utils/array.util";

const NEWS_PATH = "./data/news.json";

class NewsServiceImpl {
  getNews(): NewsPosts {
    return JSON.parse(readFileSync(NEWS_PATH, { encoding: "utf-8" }));
  }

  private writeNews(news: NewsPosts) {
    writeFileSync(NEWS_PATH, JSON.stringify(news, undefined, 2));
  }

  getTags() {
    const tags = dedup(this.getNews().news.flatMap((n) => n.tags));
    tags.sort((a, b) =>
      a.toLocaleLowerCase().localeCompare(b.toLocaleLowerCase())
    );
    return tags;
  }

  addPost(newsEntry: NewsEntry) {
    console.log("NewsServiceImpl.addPost", { newsEntry });
    const newsPosts = this.getNews();
    this.writeNews({ ...newsPosts, news: [newsEntry, ...newsPosts.news] });
  }

  getPostsToCompile() {
    return this.getNews().news.filter((news) => !news.compiled);
  }

  markPostsAsCompiled(postIds: string[]) {
    const newsPosts = this.getNews();
    this.writeNews({
      ...newsPosts,
      news: newsPosts.news.map((n) =>
        postIds.includes(n.id) ? { ...n, compiled: true } : n
      ),
    });
  }
}

export const NewsService = new NewsServiceImpl();
