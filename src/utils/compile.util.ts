export function compilePostsAsFormattedMarkdown(posts: NewsEntry[]) {
  return posts.sort(compareCreationDate).map(formatOneNews).join("\n\n");
}

function formatOneNews(news: NewsEntry) {
  return `### [${news.title}](${encodeURI(news.url)})
\\${news.tags.map((tag) => "#" + tag.replaceAll(" ", "-")).join(" ")}

${news.content.replaceAll("\r\n", "\n")}
`;
}

function compareCreationDate<T extends { creationDate: string }>(
  a: T,
  b: T
): number {
  return a.creationDate.localeCompare(b.creationDate);
}
