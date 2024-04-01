import { expect, test } from "@playwright/test";
import { HomePo, AdminPo } from "../po";

const YOUTUBE_URL = "https://www.youtube.com/watch?v=ZMQbHMgK2rw";
const YOUTUBE_URL_TITLE =
  "The Fastest Maze-Solving Competition On Earth - YouTube";
const CONTENT_SAMPLE =
  "Welcome to Micromouse, the fastest maze-solving competition on Earth.";

test("should be able to edit title, content and tags", async ({ page }) => {
  const homePo = new HomePo(page);
  const adminPo = new AdminPo(page);

  await homePo.gotoHome();
  await homePo.navigateToAdmin();
  await adminPo.signin();

  await expect(
    page.getByRole("link", { name: YOUTUBE_URL_TITLE, exact: true })
  ).toBeVisible();

  // start editing
  await page.getByRole("link", { name: "Edit " + YOUTUBE_URL_TITLE }).click();
  await expect(page.url()).toContain("/edit/");

  // edit fields
  await page.getByRole("textbox", { name: "Title" }).focus();
  await page.keyboard.press("End");
  await page.keyboard.type(" TITLE");
  await page.getByRole("textbox", { name: "Content" }).focus();
  await page.keyboard.press("End");
  await page.keyboard.type(" FRONTEND");
  await page.keyboard.press("Tab");
  await page.getByRole("textbox", { name: "Tags" }).focus();
  await page.getByRole("button", { name: "Frontend" }).click();

  // publish
  await page.getByRole("button", { name: "Publish" }).click();

  // check form state
  await expect(page.getByRole("textbox", { name: "Source" })).toHaveValue(
    YOUTUBE_URL
  );
  await expect(page.getByRole("textbox", { name: "Title" })).toHaveValue(
    YOUTUBE_URL_TITLE + " TITLE"
  );
  await expect(page.getByRole("textbox", { name: "Content" })).toHaveValue(
    CONTENT_SAMPLE + " FRONTEND"
  );
  await expect(
    page.getByTestId("selected-tags").getByRole("button", { name: "Maze" })
  ).toBeVisible();
  await expect(
    page.getByTestId("selected-tags").getByRole("button", { name: "Frontend" })
  ).toBeVisible();

  await homePo.navigateToHome();

  await expect(
    page.getByRole("link", { name: YOUTUBE_URL_TITLE + " TITLE", exact: true })
  ).toBeVisible();
  await expect(page.getByText(CONTENT_SAMPLE + " FRONTEND")).toBeVisible();
});
