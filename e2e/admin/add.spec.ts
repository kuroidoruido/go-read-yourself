import { expect, test } from "@playwright/test";
import { HomePo, AdminPo, AdminAddPo } from "../po";

const YOUTUBE_URL = "https://youtu.be/RL6vPya6BVY?si=mux6nJwuuHQIX7aw";
const YOUTUBE_URL_CLEAN = "https://youtu.be/RL6vPya6BVY";
const YOUTUBE_URL_TITLE = "L'HISTOIRE DU RICKROLL ! - YouTube";
const CONTENT_SAMPLE =
  "L'histoire du rickroll de 4chan à la diffusion partout sur le web ! Je ne savais pas d'où ça venait maintenant je sais 😁";
/**
 * StyleX url is used the page have multiple titles
 */
const STYLEX_URL = "https://stylexjs.com/";
const STYLEX_URL_TITLE = "StyleX";

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

  await adminAddPo.pasteInUrlField(STYLEX_URL);
  await page
    .getByRole("combobox", { name: "Title candidates" })
    .selectOption(STYLEX_URL_TITLE);
  await expect(page.getByRole("textbox", { name: "Title" })).toHaveValue(
    STYLEX_URL_TITLE
  );
});

test("should be able to add tags", async ({ page, context }) => {
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
  await page.getByRole("button", { name: "Add" }).click();
  // choose existing tag from keyboard
  await page.getByRole("textbox", { name: "Tags" }).click();
  await page.keyboard.type("div");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");
  // choose existing tag by clicking on it
  await page.getByRole("textbox", { name: "Tags" }).click();
  await page.keyboard.type("fRONt");
  await page
    .getByTestId("suggested-list")
    .getByRole("button", { name: "Frontend" })
    .click();
  // choose suggested tag
  await page
    .getByTestId("suggested-list")
    .getByRole("button", { name: "Web" })
    .click();

  // choose see correct selected tags
  await expect(
    page.getByTestId("selected-tags").getByTestId("tag")
  ).toHaveCount(4);
  await expect(
    page.getByTestId("selected-tags").getByRole("button", { name: "Meme" })
  ).toBeVisible();
  await expect(
    page.getByTestId("selected-tags").getByRole("button", { name: "Divers" })
  ).toBeVisible();
  await expect(
    page.getByTestId("selected-tags").getByRole("button", { name: "Frontend" })
  ).toBeVisible();
  await expect(
    page.getByTestId("selected-tags").getByRole("button", { name: "Web" })
  ).toBeVisible();
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
  await page.getByRole("textbox", { name: "Tags" }).click();
  // add a tag
  await page
    .getByTestId("suggested-list")
    .getByRole("button", { name: "Web" })
    .click();

  // publish
  await page.getByRole("button", { name: "Publish" }).click();

  await expect(page.getByRole("textbox", { name: "Title" })).toHaveValue("");

  await homePo.navigateToHome();

  await expect(
    page.getByRole("link", { name: YOUTUBE_URL_TITLE })
  ).toBeVisible();
  await expect(page.getByText(CONTENT_SAMPLE)).toBeVisible();
});
