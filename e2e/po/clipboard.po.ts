import type { BrowserContext, Page } from "@playwright/test";
import os from "node:os";

export class ClipboardPo {
  private hasGrandedPermissions = false;
  constructor(private page: Page, private context: BrowserContext) {}

  async grantPermissions() {
    if (this.hasGrandedPermissions) {
      return;
    }
    await this.context.grantPermissions(["clipboard-read", "clipboard-write"]);
    this.hasGrandedPermissions = true;
  }

  async get() {
    const handle = await this.page.evaluateHandle(() =>
      navigator.clipboard.readText()
    );
    return handle.jsonValue();
  }

  set(text: string) {
    return this.page.evaluateHandle(`navigator.clipboard.writeText("${text}")`);
  }

  paste() {
    const isMac = os.platform() === "darwin";
    const modifier = isMac ? "Meta" : "Control";
    return this.page.keyboard.press(`${modifier}+KeyV`);
  }
}
