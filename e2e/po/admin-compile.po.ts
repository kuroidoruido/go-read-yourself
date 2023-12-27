import { expect } from "@playwright/test";
import type { Page } from "@playwright/test";

export class AdminCompilePo {
  constructor(private page: Page) {}

  copyVisible() {
    return expect(
      this.page.getByRole("button", { name: "Copy" })
    ).toBeVisible();
  }

  copy() {
    return this.page.getByRole("button", { name: "Copy" }).click();
  }

  markAsCompileVisible() {
    return expect(
      this.page.getByRole("button", { name: "Mark as compiled" })
    ).toBeVisible();
  }

  markAsCompile() {
    return this.page.getByRole("button", { name: "Mark as compiled" }).click();
  }

  checkTextbox(content: string | RegExp) {
    return expect(this.page.getByRole("textbox")).toContainText(content);
  }
}
