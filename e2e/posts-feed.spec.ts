import { test, expect } from "@playwright/test";
import { HomePo } from "./po/home.po";

test("feed correctly displayed", async ({ page }) => {
  const homePo = new HomePo(page);
  await homePo.gotoHome();
  await homePo.canSeeNewsFeed();
});

test("full feed can be correctly displayed", async ({ page }) => {
  const homePo = new HomePo(page);
  await homePo.gotoHome();

  await homePo.canSeeNewsFeed({ count: 10 });
  await page.getByText("Load more", { exact: true }).click();
  await expect(page.url()).toContain("/all");
  await homePo.canSeeNewsFeed({ atLeast: 38 });
});

test("RSS feed is available", async ({ page }) => {
  const homePo = new HomePo(page);
  await homePo.gotoHome();

  await expect(page.getByText("RSS")).toBeVisible();
  await page.getByText("RSS").click();
  await expect(page).toHaveURL(/.*\/feed.xml/);
});
