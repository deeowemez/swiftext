import { test } from "../../utils/fixture";

test.describe("Navigate to Home Page", () => {
  test("Navigate to Home Page from Header", async ({ header }) => {
    await header.clickLogo();
  });

  test("Navigate to Home Page from Footer", async ({ footer }) => {
    await footer.clickLogo();
  });

  test.afterEach(async ({ homePage }) => {
    await homePage.checkURL();
    await homePage.checkTutorialGifVisibility();
  });
});
