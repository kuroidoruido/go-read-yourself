import { test, expect } from "@playwright/test";
import { HomePo, AdminPo, ClipboardPo, AdminCompilePo } from "../po";

test("compile page correctly displayed", async ({ page }) => {
  const homePo = new HomePo(page);
  const adminPo = new AdminPo(page);
  const adminCompilePo = new AdminCompilePo(page);

  await homePo.gotoHome();
  await homePo.navigateToAdmin();
  await adminPo.signin();

  await homePo.navigateToAdminCompile();

  await adminCompilePo.copyVisible();
  await adminCompilePo.markAsCompileVisible();
  await adminCompilePo.checkTextbox(/## Frontend/);
  await adminCompilePo.checkTextbox(/## Sécurité/);
  await adminCompilePo.checkTextbox(/## Divers/);
  await adminCompilePo.checkTextbox(
    /### \[La spécification ECMAScript 2023 pour JavaScript inclut de nouvelles méthodes pour les tableaux, notamment la possibilité de rechercher un élément dans un tableau à partir de la fin du tableau\]\(https:\/\/javascript.developpez.com\/actu\/343360\/La-specification-ECMAScript-2023-pour-JavaScript-inclut-de-nouvelles-methodes-pour-les-tableaux-notamment-la-possibilite-de-rechercher-un-element-dans-un-tableau-a-partir-de-la-fin-du-tableau\/\)/
  );
});

test("copy should copy textbox", async ({ page, context }) => {
  const homePo = new HomePo(page);
  const adminPo = new AdminPo(page);
  const adminCompilePo = new AdminCompilePo(page);
  const clipboardPo = new ClipboardPo(page, context);

  await homePo.gotoHome();
  await clipboardPo.grantPermissions();
  await homePo.navigateToAdmin();
  await adminPo.signin();

  await homePo.navigateToAdminCompile();

  await adminCompilePo.copy();

  const clipboardContent = await clipboardPo.get();
  await adminCompilePo.checkTextbox(clipboardContent);
});

test("mark as compiled should clean the textbox", async ({ page, context }) => {
  const homePo = new HomePo(page);
  const adminPo = new AdminPo(page);
  const adminCompilePo = new AdminCompilePo(page);
  const clipboardPo = new ClipboardPo(page, context);

  await homePo.gotoHome();
  await page.route(
    (url) => url.search.includes("markAsCompiled"),
    async (route) => {
      return route.continue({
        url: route.request().url().split("=")[0] + "=",
      });
    }
  );

  await clipboardPo.grantPermissions();
  await homePo.navigateToAdmin();
  await adminPo.signin();

  await homePo.navigateToAdminCompile();

  await adminCompilePo.markAsCompile();

  await expect(page.url()).toContain("/compile?markAsCompiled=");
});
