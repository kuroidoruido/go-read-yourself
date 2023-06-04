declare interface AppConfig {
  title: string;
  user: {
    salt: string;
  };
  card: {
    dateFormat: string;
  };
}

declare type Email = string;
declare type AppUsers = Record<Email, AppUser>;

declare interface AppUser {
  password: "203732a7ef02895c50f25b75ba59c8d3f8331447e29aa955653a89f503e88c1c";
  name: "Anthony";
}

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
