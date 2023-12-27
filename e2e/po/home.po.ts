import { expect } from "@playwright/test";
import type { Page } from "@playwright/test";

export class HomePo {
  constructor(private page: Page) {}

  async gotoHome() {
    await this.page.goto("/");
    await expect(this.page).toHaveTitle(/Go Read Yourself/);
  }

  navigateToHome() {
    return this.page.getByText("Go Read Yourself", { exact: true }).click();
  }

  navigateToAdmin() {
    return this.page.getByText("❤️", { exact: true }).click();
  }

  navigateToAdminCompile() {
    return this.page.getByText("Compile", { exact: true }).click();
  }

  navigateToAdminAdd() {
    return this.page.getByText("Add", { exact: true }).click();
  }

  async canSeeNewsFeed({
    count = 10,
    atLeast = Number.NEGATIVE_INFINITY,
  } = {}) {
    await expect(this.page.getByTestId("news-container")).toBeVisible();
    if (atLeast === Number.NEGATIVE_INFINITY) {
      await expect(this.page.getByTestId("news-card")).toHaveCount(count);
    } else {
      await expect
        .poll(() => this.page.getByTestId("news-card").count())
        .toBeGreaterThanOrEqual(atLeast);
    }
  }
}
