declare interface NewsPosts {
  news: NewsEntry[];
}

interface NewsEntry {
  id: string;
  title: string;
  creationDate: string;
  url: string;
  tags: string[];
  content: string;
  compiled?: boolean;
}
