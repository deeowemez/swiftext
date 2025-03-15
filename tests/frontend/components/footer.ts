import { Page } from "playwright";
import { test, expect } from "@playwright/test";

class Footer {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async gotoHomePage() {
    await this.page.goto("http://localhost:5173/");
  }

  async clickLogo() {
    await this.page
      .getByRole("link", { name: "Swiftext Logo Swiftext" })
      .nth(1)
      .click();
  }
}

export default Footer;
