import { readFileSync } from "node:fs";

const CONFIG_PATH = "./data/config.json";

class ConfigServiceImpl {
  getConfig(): AppConfig {
    return JSON.parse(readFileSync(CONFIG_PATH, { encoding: "utf-8" }));
  }
}

export const ConfigService = new ConfigServiceImpl();
