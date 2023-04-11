/// <reference types="astro/client" />

interface NewsEntry {
  id: string;
  title: string;
  creationDate: string;
  url: string;
  tags: string[];
  content: string;
  compiled?: boolean;
}
