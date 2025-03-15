import { test as base } from "@playwright/test";
import HomePage from "../pages/homePage";
import Header from "../components/header";
import Footer from "../components/footer";
import Login from "../components/login";
import CreateAccount from "../components/createAccount";
import FilesPage from "../pages/filesPage";
import EditPage from "../pages/editPage";

// Extend base test
export const test = base.extend({
  homePage: async ({ page }, use) => {
    // Set up the fixture
    const homePage = new HomePage(page);
    await homePage.goto();

    // Use the fixture value in the test
    await use(homePage);

    // Clean up the fixture
    await page.close();
  },

  header: async ({ page }, use) => {
    const header = new Header(page);
    await header.gotoHomePage();
    await use(header);
    await page.close();
  },

  footer: async ({ page }, use) => {
    const footer = new Footer(page);
    await footer.gotoHomePage();
    await use(footer);
    await page.close();
  },

  login: async ({ page }, use) => {
    const login = new Login(page);
    await use(login);
    await page.close();
  },

  createAccount: async ({ page }, use) => {
    const createAccount = new CreateAccount(page);
    await use(createAccount);
    await page.close();
  },

  editPage: async ({ page }, use) => {
    const editPage = new EditPage(page);
    await use(editPage);
    await page.close();
  },

  filesPage: async ({ page }, use) => {
    const filesPage = new FilesPage(page);
    await filesPage.goto();
    await use(filesPage);
    await page.close();
  },
});
