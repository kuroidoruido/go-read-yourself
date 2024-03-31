import { Marked } from "marked";

export type UrlStatus = { url: string; status: "ok" | "ko" };

export function renderPreview(md: string, linksStatus: UrlStatus[]) {
  const markedPreview = new Marked();
  markedPreview.use({
    renderer: {
      link(href, _, text) {
        const found = linksStatus.find((link) => link.url === href);
        if (!found) {
          return false;
        }
        const linkClass = found.status === "ok" ? "link-ok" : "link-ko";
        return `<a class="${linkClass}" href="${href}">${text}</a>`;
      },
    },
  });
  return markedPreview.parse(md);
}

export function checkLinks(links: string[]) {
  return Promise.all(
    links.map(
      (url): Promise<UrlStatus> =>
        fetch(url)
          .then(
            ({ status, statusText }): UrlStatus => ({
              url,
              status: 200 <= status && status < 300 ? "ok" : "ko",
              ...{ error: `${status} ${statusText}` },
            })
          )
          .catch(
            (reason): UrlStatus => ({ url, status: "ko", ...{ error: reason } })
          )
    )
  );
}
