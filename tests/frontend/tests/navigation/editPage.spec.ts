import { test } from "../../utils/fixture";

test.describe("Login with Sample Credentials", () => {
  test.beforeEach("Login through Home Page", async ({ header, login }) => {
    await header.clickLogInButton();
    await login.checkLoginModalVisibility();
    await login.inputSampleEmail();
    await login.inputSamplePassword();
    await login.clickLoginButton();
    await login.checkLoginSuccessfulOverlayVisibility();
  });

  test.describe("Navigate to Edit Page", () => {
    test("Navigate to Edit Page from Files Page", async ({ filesPage }) => {
      await filesPage.clickSampleFile();
    });

    test.afterEach(async ({ editPage }) => {
      await editPage.checkURL();
      await editPage.checkSampleFileVisibility();
      await editPage.checkConfigBarVisibility();
      await editPage.checkControlBarVisibility();
      await editPage.checkToolbarVisibility();
    });
  });
});
