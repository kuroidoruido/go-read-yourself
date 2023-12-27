import { expect } from "@playwright/test";
import type { Page } from "@playwright/test";

export const VALID_EMAIL = "admin@example.com";
export const VALID_PASSWORD = "P@ssw0rd";
export const INVALID_EMAIL = "invalid@example.com";
export const INVALID_PASSWORD = "WrongPass";

export class AdminPo {
  constructor(private page: Page) {}

  async signinFormVisible() {
    await expect(
      this.page.getByRole("button", { name: "Sign in" })
    ).toBeVisible();
  }

  async signin(email: string = VALID_EMAIL, password: string = VALID_PASSWORD) {
    await this.page.getByRole("textbox", { name: "Email" }).fill(email);
    await this.page.getByRole("textbox", { name: "Password" }).fill(password);
    await this.page.getByRole("button", { name: "Sign in" }).click();
  }
}
