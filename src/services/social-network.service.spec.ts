import { describe, expect, it } from "vitest";
import { SocialNetworkService, SocialNetwork } from "./social-network.service";

describe(SocialNetworkService.getSocialNetworkFromUrl.name, () => {
  it.each([
    ["", "UNKNOWN"],
    [null, "UNKNOWN"],
    [undefined, "UNKNOWN"],
    ...socialNetworkCaseGenerator("Bluesky", "bsky.app", "bsky.social"),
    ...socialNetworkCaseGenerator("Dev.to", "dev.to"),
    ...socialNetworkCaseGenerator(
      "Facebook",
      "facebook.com",
      "facebook.co",
      "facebook.net",
      "fbcdn.net",
      "fb.com"
    ),
    ...socialNetworkCaseGenerator("Github", "github.com", "github.io"),
    ...socialNetworkCaseGenerator(
      "Instagram",
      "instagram.com",
      "ig.me",
      "cdninstagram.com"
    ),
    ...socialNetworkCaseGenerator(
      "LinkedIn",
      "linkedin.com",
      "linkedin.cn",
      "lnkd.in",
      "linkedin.cn",
      "linkedin.at",
      "licdn.cn",
      "licdn.com"
    ),
    ...socialNetworkCaseGenerator(
      "Mastodon",
      "piaille.fr",
      "mstdn.social",
      "mas.to",
      "m.cmx.im"
    ),
    ...socialNetworkCaseGenerator("Medium", "medium.com"),
    ...socialNetworkCaseGenerator("Reddit", "reddit.com", "redd.it"),
    ...socialNetworkCaseGenerator("Threads", "threads.net"),
    ...socialNetworkCaseGenerator(
      "Twitter/X",
      "x.com",
      "t.co",
      "twitter.com",
      "fxtwitter.com",
      "fixupx.com"
    ),
    ...socialNetworkCaseGenerator(
      "Youtube",
      "yt.be",
      "youtu.be",
      "youtube.com"
    ),
    ...socialNetworkCaseGenerator("UNKNOWN", "example.com"),
  ] satisfies [string | undefined | null, SocialNetwork][])(
    "should map correctly %s => %s",
    (url: string | undefined | null, socialNetwork: SocialNetwork) => {
      expect(SocialNetworkService.getSocialNetworkFromUrl(url)).toBe(
        socialNetwork
      );
    }
  );
});

function socialNetworkCaseGenerator(
  socialNetwork: SocialNetwork,
  ...domains: string[]
): [string | undefined | null, SocialNetwork][] {
  return domains.flatMap((domain) => [
    [domain, socialNetwork],
    [`http://${domain}`, socialNetwork],
    [`https://${domain}`, socialNetwork],
    [`https://www.${domain}`, socialNetwork],
    [`https://foo.bar.${domain}`, socialNetwork],
    [`ftp://${domain}`, socialNetwork],
    [`https://${domain}/foo`, socialNetwork],
    [`https://${domain}/foo/bar/baz`, socialNetwork],
    [`https://${domain}/foo.php`, socialNetwork],
    [`https://${domain}/foo.php?foo=bar`, socialNetwork],
    [`https://${domain}.foo`, "UNKNOWN"],
    [`https://${domain}.foo.bar`, "UNKNOWN"],
    [`https://example.com/foo.php?referal=${domain}`, "UNKNOWN"],
  ]);
}

describe(SocialNetworkService.getIcon.name, () => {
  it.each(SocialNetwork)(
    "should have an icon %s",
    (socialNetwork: SocialNetwork) => {
      expect(SocialNetworkService.getIcon(socialNetwork)).not.toBeNull();
    }
  );
});
