import { defineConfig, passthroughImageService } from "astro/config";
import node from "@astrojs/node";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  image: {
    service: passthroughImageService()
  },
  output: "server",
  site: "https://press.k49.fr.nf",
  adapter: node({
    mode: "standalone"
  }),
  integrations: [react()]
});