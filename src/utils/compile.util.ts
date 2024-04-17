import { isDefined } from "./fp.util";
import { tryGetUrlPreview, tryGetYoutubeThumbnail } from "./post.util";

interface Options {
  byTags?: string[];
  defaultGroupName?: string;
}

export function compilePostsAsFormattedMarkdown(
  posts: NewsEntry[],
  { byTags = [], defaultGroupName = "" }: Options = {}
) {
  const postsSortedByCreationDate = posts.sort(compareCreationDate);
  const postsGroupedByTags = postsSortedByCreationDate
    .map((post): [string, NewsEntry] => [
      byTags.find((tag) => post.tags.includes(tag)) ?? defaultGroupName,
      post,
    ])
    .reduce((groups, [tag, post]) => {
      if (!(tag in groups)) {
        groups[tag] = [];
      }
      groups[tag]?.push(post);
      return groups;
    }, {} as { [tag: string]: NewsEntry[] });

  const groups = Object.keys(postsGroupedByTags);
  if (groups.length === 1) {
    return formatAll(postsGroupedByTags[groups[0]!]!);
  }
  const tags = [...byTags];
  if (!tags.includes(defaultGroupName)) {
    tags.push(defaultGroupName);
  }
  return tags
    .filter((tag) => isDefined(postsGroupedByTags[tag]))
    .map((group) => `## ${group}\n\n${formatAll(postsGroupedByTags[group]!)}`)
    .join("\n");
}

function formatAll(posts: NewsEntry[]) {
  return posts.map(formatOneNews).join("\n");
}

function formatOneNews(news: NewsEntry) {
  const previews = tryGetUrlPreview(news.url);

  return `### [${news.title}](${encodeURI(news.url)})
\\${news.tags.map((tag) => "#" + tag.replaceAll(" ", "-")).join(" ")}

${previews}${news.content.replaceAll("\r\n", "\n")}
`;
}

function compareCreationDate<T extends { creationDate: string }>(
  a: T,
  b: T
): number {
  return a.creationDate.localeCompare(b.creationDate);
}
