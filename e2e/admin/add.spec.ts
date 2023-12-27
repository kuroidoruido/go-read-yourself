import { expect, test } from "@playwright/test";
import { HomePo, AdminPo, AdminAddPo } from "../po";

const YOUTUBE_URL = "https://youtu.be/RL6vPya6BVY?si=mux6nJwuuHQIX7aw";
const YOUTUBE_URL_CLEAN = "https://youtu.be/RL6vPya6BVY";
const YOUTUBE_URL_TITLE = "L'HISTOIRE DU RICKROLL ! - YouTube";
const CONTENT_SAMPLE =
  "L'histoire du rickroll de 4chan à la diffusion partout ! Je ne savais pas d'où ça venait maintenant je sais 😁";

test("can access add a post page", async ({ page, context }) => {
  const homePo = new HomePo(page);
  const adminPo = new AdminPo(page);
  const adminAddPo = new AdminAddPo(page, context);

  await homePo.gotoHome();
  await homePo.navigateToAdmin();
  await adminPo.signin();

  await homePo.navigateToAdminAdd();
  await adminAddPo.addFullFormVisible();
});

test("youtube url should be cleaned up", async ({ page, context }) => {
  const homePo = new HomePo(page);
  const adminPo = new AdminPo(page);
  const adminAddPo = new AdminAddPo(page, context);

  await homePo.gotoHome();
  await homePo.navigateToAdmin();
  await adminPo.signin();

  await homePo.navigateToAdminAdd();
  await adminAddPo.addFormVisible();

  await adminAddPo.pasteInUrlField(YOUTUBE_URL);
  await expect(page.getByRole("textbox", { name: "Source" })).toHaveValue(
    YOUTUBE_URL_CLEAN
  );
});

test("should be able to set the title from source page title candidates", async ({
  page,
  context,
}) => {
  const homePo = new HomePo(page);
  const adminPo = new AdminPo(page);
  const adminAddPo = new AdminAddPo(page, context);

  await homePo.gotoHome();
  await homePo.navigateToAdmin();
  await adminPo.signin();

  await homePo.navigateToAdminAdd();
  await adminAddPo.addFormVisible();

  await adminAddPo.pasteInUrlField(YOUTUBE_URL);
  await page
    .getByRole("combobox", { name: "Title candidates" })
    .selectOption(YOUTUBE_URL_TITLE);
  await expect(page.getByRole("textbox", { name: "Title" })).toHaveValue(
    YOUTUBE_URL_TITLE
  );
});

test("should be able to publish a post", async ({ page, context }) => {
  const homePo = new HomePo(page);
  const adminPo = new AdminPo(page);
  const adminAddPo = new AdminAddPo(page, context);

  await homePo.gotoHome();
  await homePo.navigateToAdmin();
  await adminPo.signin();

  await homePo.navigateToAdminAdd();
  await adminAddPo.addFormVisible();

  // fill source url
  await adminAddPo.pasteInUrlField(YOUTUBE_URL);
  // choose title from candidates
  await page
    .getByRole("combobox", { name: "Title candidates" })
    .selectOption(YOUTUBE_URL_TITLE);
  await expect(page.getByRole("textbox", { name: "Title" })).toHaveValue(
    YOUTUBE_URL_TITLE
  );
  // fill content
  await page.getByRole("textbox", { name: "Content" }).fill(CONTENT_SAMPLE);
  // add custom tag
  await page.getByRole("textbox", { name: "Tags" }).fill("Meme");
  // choose existing tag
  await page.getByRole("button", { name: "Divers" }).click();
  await expect(page.getByRole("textbox", { name: "Tags" })).toHaveValue(
    "Meme, Divers"
  );
  // publish
  await page.getByRole("button", { name: "Publish" }).click();

  await expect(page.getByRole("textbox", { name: "Title" })).toHaveValue("");

  await homePo.navigateToHome();

  await expect(
    page.getByRole("link", { name: YOUTUBE_URL_TITLE })
  ).toBeVisible();
  await expect(page.getByText(CONTENT_SAMPLE)).toBeVisible();
});
