import { defineConfig } from "astro/config";

import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  output: "server",
  site: "https://press.k49.fr.nf",
  adapter: node({
    mode: "standalone",
  }),
});
