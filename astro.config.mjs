import { defineConfig, passthroughImageService } from "astro/config";
import icon from "astro-icon";
import node from "@astrojs/node";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  image: {
    service: passthroughImageService(),
  },
  output: "server",
  site: "https://press.k49.fr.nf",
  adapter: node({
    mode: "standalone",
  }),
  integrations: [
    react(),
    icon({
      include: {
        lucide: [
          "alert-triangle",
          "badge-check",
          "copy",
          "file-edit",
          "file-plus",
          "file-search",
          "home",
          "info",
          "list-checks",
          "log-out",
          "newspaper",
          "refresh-cw",
          "rss",
        ],
        mdi: ["dev-to"],
        tabler: [
          "brand-bluesky",
          "brand-facebook",
          "brand-github",
          "brand-instagram",
          "brand-linkedin",
          "brand-mastodon",
          "brand-medium",
          "brand-reddit",
          "brand-threads",
          "brand-x",
          "brand-youtube",
        ],
      },
    }),
  ],
});
