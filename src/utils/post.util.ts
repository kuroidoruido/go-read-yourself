export function isYoutubeLink(url: string | null | undefined): boolean {
  if (!url) {
    return false;
  }
  return url.includes("youtube.com") || url.includes("youtu.be");
}

export function extractYoutubeVideoId(
  url: string | null | undefined
): string | null {
  if (!url) {
    return null;
  }
  if (url.includes("?v=")) {
    return url.split("?v=")[1]!;
  }
  if (url.includes("youtu.be/")) {
    return url.split("?")[0]?.split("youtu.be/")[1]!;
  }
  if (url.includes("youtube.com/shorts/")) {
    return url.split("?")[0]?.split("youtube.com/shorts/")[1]!;
  }
  return null;
}

export function getThumbnailLink(
  youtubeVideoId: string | undefined | null
): string {
  return `https://i.ytimg.com/vi/${youtubeVideoId}/hqdefault.jpg`;
}

export function tryGetYoutubeThumbnail(
  url: string | null | undefined
): string | null {
  if (!isYoutubeLink(url)) {
    return null;
  }
  return getThumbnailLink(extractYoutubeVideoId(url));
}

function buildYoutubeVideoPreviewMd(
  url: string,
  youtubeThumbnail: string | null | undefined
) {
  return youtubeThumbnail
    ? `[![${url}](${youtubeThumbnail} "Youtube video preview")](${url})\n\n`
    : "";
}

function tryGetImagePreviewThumbnail(url: string) {
  return [
    ".jpg",
    ".jpeg",
    ".png",
    ".svg",
    ".gif",
    ".webp",
    ".tif",
    ".bmp",
  ].some((ext) => url.endsWith(ext))
    ? url
    : undefined;
}

function buildImagePreviewMd(imageUrl: string | null | undefined) {
  return imageUrl ? `![${imageUrl}](${imageUrl} "Image preview")\n\n` : "";
}

export function tryGetUrlPreview(url: string) {
  const videoPreview = buildYoutubeVideoPreviewMd(
    url,
    tryGetYoutubeThumbnail(url)
  );
  const imagePreview = buildImagePreviewMd(tryGetImagePreviewThumbnail(url));

  return videoPreview + imagePreview;
}
