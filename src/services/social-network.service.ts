import { match } from "ts-pattern";
import { isNotDefinedOrEmpty } from "../utils/fp.util";
import MASTODON_SERVERS from "./mastodon-servers.data.json";

class SocialNetworkServiceImpl {
  getSocialNetworkFromUrl(url: string | undefined | null): SocialNetwork {
    if (isNotDefinedOrEmpty(url)) {
      return "UNKNOWN";
    }
    return match(url.includes("://") ? new URL(url) : url)
      .when(...whenDomain("Bluesky", ["bsky.app", "bsky.social"]))
      .when(...whenDomain("Dev.to", ["dev.to"]))
      .when(
        ...whenDomain("Facebook", [
          "facebook.com",
          "facebook.co",
          "facebook.net",
          "fbcdn.net",
          "fb.com",
        ])
      )
      .when(...whenDomain("Github", ["github.com", "github.io"]))
      .when(
        ...whenDomain("Instagram", [
          "instagram.com",
          "ig.me",
          "cdninstagram.com",
        ])
      )
      .when(
        ...whenDomain("LinkedIn", [
          "linkedin.com",
          "linkedin.cn",
          "lnkd.in",
          "linkedin.cn",
          "linkedin.at",
          "licdn.cn",
          "licdn.com",
        ])
      )
      .when(...whenDomain("Medium", ["medium.com"]))
      .when(...whenDomain("Reddit", ["reddit.com", "redd.it"]))
      .when(...whenDomain("Threads", ["threads.net"]))
      .when(...whenDomain("Twitter/X", ["t.co", "twitter.com", "x.com"]))
      .when(...whenDomain("Youtube", ["yt.be", "youtu.be", "youtube.com"]))
      .when(...whenDomain("Mastodon", MASTODON_SERVERS))
      .otherwise((): SocialNetwork => "UNKNOWN");
  }

  getIcon(socialNetwork: SocialNetwork): string | null {
    return SOCIAL_NETWORK_ICON[socialNetwork] ?? null;
  }
}

function whenDomain(socialNetwork: SocialNetwork, domains: string[]) {
  return [
    (url: URL | string) =>
      typeof url === "string"
        ? domains.some((domain) => domain === url || url.endsWith("." + domain))
        : domains.some(
            (domain) =>
              domain === url.hostname || url.hostname.endsWith("." + domain)
          ),
    (): SocialNetwork => socialNetwork,
  ] as const;
}

export const SocialNetwork = [
  "Bluesky",
  "Dev.to",
  "Facebook",
  "Github",
  "Instagram",
  "LinkedIn",
  "Mastodon",
  "Medium",
  "Reddit",
  "Threads",
  "Twitter/X",
  "Youtube",
] as const;

export type SocialNetwork = (typeof SocialNetwork)[number] | "UNKNOWN";

const SOCIAL_NETWORK_ICON: Record<SocialNetwork, string | null> = {
  UNKNOWN: null,
  Bluesky: "tabler:brand-bluesky",
  "Dev.to": "mdi:dev-to",
  Facebook: "tabler:brand-facebook",
  Github: "tabler:brand-github",
  Instagram: "tabler:brand-instagram",
  LinkedIn: "tabler:brand-linkedin",
  Mastodon: "tabler:brand-mastodon",
  Medium: "tabler:brand-medium",
  Reddit: "tabler:brand-reddit",
  Threads: "tabler:brand-threads",
  "Twitter/X": "tabler:brand-x",
  Youtube: "tabler:brand-youtube",
};

export const SocialNetworkService = new SocialNetworkServiceImpl();
