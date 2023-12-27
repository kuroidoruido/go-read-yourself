import { expect } from "@playwright/test";
import type { BrowserContext, Page } from "@playwright/test";
import { ClipboardPo } from "./clipboard.po";

export class AdminAddPo {
  private clipboardPo: ClipboardPo;

  constructor(private page: Page, context: BrowserContext) {
    this.clipboardPo = new ClipboardPo(page, context);
  }

  async addFormVisible() {
    await expect(
      this.page.getByRole("button", { name: "Publish" })
    ).toBeVisible();
  }

  async addFullFormVisible() {
    await expect(
      this.page.getByRole("textbox", { name: "Source" })
    ).toBeVisible();
    await expect(
      this.page.getByRole("button", { name: "Retry grab metadata" })
    ).toBeVisible();
    await expect(
      this.page.getByRole("combobox", { name: "Title candidates" })
    ).toBeVisible();
    await expect(
      this.page.getByRole("textbox", { name: "Title" })
    ).toBeVisible();
    await expect(
      this.page.getByRole("textbox", { name: "Content" })
    ).toBeVisible();
    await expect(
      this.page.getByRole("textbox", { name: "Tags" })
    ).toBeVisible();
    await expect(this.page.getByTestId("tag")).not.toHaveCount(0);
    await expect(
      this.page.getByRole("button", { name: "Publish" })
    ).toBeVisible();
    await expect(
      this.page.getByRole("button", { name: "Reset" })
    ).toBeVisible();
  }

  async pasteInUrlField(url: string) {
    await this.clipboardPo.grantPermissions();
    await this.page.getByRole("textbox", { name: "Source" }).click();
    await this.clipboardPo.set(url);
    await this.clipboardPo.paste();
    this.page.getByRole("button", { name: "Retry grab metadata" }).click();
  }
}
