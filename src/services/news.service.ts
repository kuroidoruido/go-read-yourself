import { readFileSync, writeFileSync } from "node:fs";

const NEWS_PATH = "./data/news.json";

class NewsServiceImpl {
  getNews(): NewsPosts {
    return JSON.parse(readFileSync(NEWS_PATH, { encoding: "utf-8" }));
  }

  getNewsPost(postId: string): NewsEntry | undefined {
    return this.getNews().news.find((post) => post.id === postId);
  }

  private writeNews(news: NewsPosts) {
    writeFileSync(NEWS_PATH, JSON.stringify(news, undefined, 2));
  }

  addPost(newsEntry: NewsEntry) {
    console.log("NewsServiceImpl.addPost", { newsEntry });
    const newsPosts = this.getNews();
    this.writeNews({ ...newsPosts, news: [newsEntry, ...newsPosts.news] });
  }

  editPost(newsEntry: NewsEntry) {
    console.log("NewsServiceImpl.editPost", { newsEntry });
    const newsPosts = this.getNews();
    const posts = [...newsPosts.news];
    posts[posts.findIndex((p) => p.id === newsEntry.id)] = newsEntry;
    this.writeNews({ ...newsPosts, news: posts });
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
