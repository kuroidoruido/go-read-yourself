import { test, expect } from "@playwright/test";
import {
  HomePo,
  AdminPo,
  INVALID_EMAIL,
  INVALID_PASSWORD,
  VALID_EMAIL,
  VALID_PASSWORD,
} from "../po";

test("admin link is available on the footer", async ({ page }) => {
  const homePo = new HomePo(page);

  await homePo.gotoHome();

  await expect(page.getByText("❤️", { exact: true })).toBeVisible();
});

test("no admin page links are availabel before sign in", async ({ page }) => {
  const homePo = new HomePo(page);

  await homePo.gotoHome();

  await expect(page.getByRole("link", { name: "Compile" })).not.toBeVisible();
  await expect(page.getByRole("link", { name: "Sign out" })).not.toBeVisible();
  await expect(page.getByRole("link", { name: "Add" })).not.toBeVisible();
});

test("can sign in and see admin features", async ({ page }) => {
  const homePo = new HomePo(page);
  const adminPo = new AdminPo(page);

  await homePo.gotoHome();

  await homePo.navigateToAdmin();
  await adminPo.signinFormVisible();

  await adminPo.signin();
  await expect(page.getByTestId("news-container")).toBeVisible();
  await expect(page.getByRole("link", { name: "Compile" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Sign out" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Add" })).toBeVisible();
});

test("cannot sign in with wrong credentials", async ({ page }) => {
  const homePo = new HomePo(page);
  const adminPo = new AdminPo(page);

  await homePo.gotoHome();

  await homePo.navigateToAdmin();
  await adminPo.signinFormVisible();

  await adminPo.signin(INVALID_EMAIL, INVALID_PASSWORD);
  await adminPo.signinFormVisible();

  await adminPo.signin(INVALID_EMAIL, VALID_PASSWORD);
  await adminPo.signinFormVisible();

  await adminPo.signin(VALID_EMAIL, INVALID_PASSWORD);
  await adminPo.signinFormVisible();
});

test("sign out hide admin features", async ({ page }) => {
  const homePo = new HomePo(page);
  const adminPo = new AdminPo(page);

  await homePo.gotoHome();

  await homePo.navigateToAdmin();
  await adminPo.signinFormVisible();

  await adminPo.signin();
  await expect(page.getByTestId("news-container")).toBeVisible();
  await expect(page.getByRole("link", { name: "Compile" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Sign out" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Add" })).toBeVisible();

  await page.getByRole("link", { name: "Sign out" }).click();

  await expect(page.getByTestId("news-container")).toBeVisible();
  await expect(page.getByRole("link", { name: "Compile" })).not.toBeVisible();
  await expect(page.getByRole("link", { name: "Sign out" })).not.toBeVisible();
  await expect(page.getByRole("link", { name: "Add" })).not.toBeVisible();
});
