import { Page } from "playwright";
import { test, expect } from "@playwright/test";

class EditPage {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async gotoSampleFileEditPage() {
    await this.page.goto(
      "http://localhost:5173/edit/uploads/1734431358684.pdf",
    );
  }

  async checkURL() {
    const currentURL = this.page.url();
    expect(currentURL).toBe(
      "http://localhost:5173/edit/uploads/1734431358684.pdf",
    );
  }

  async checkSampleFileVisibility() {
    await expect(
      this.page.getByText(
        "A Comprehensive Dengue Prediction System for Baguio City: Incorporating aData-",
      ),
    ).toBeVisible();
  }

  // Control Bar

  async checkControlBarVisibility() {
    await expect(this.page.locator(".flex > div > div").first()).toBeVisible();
  }

  async clickHomeIcon() {
    await this.page.getByRole("link", { name: "home-icon" }).click();
  }

  async clickColorPaletteIcon() {
    await this.page.getByRole("img", { name: "color-palette-icon" }).click();
  }

  async clickZoomInIcon() {
    await this.page.getByRole("img", { name: "zoom-in-icon" }).click();
  }

  async clickZoomOutIcon() {
    await this.page.getByRole("img", { name: "zoom-out-icon" }).click();
  }

  async clickTrashIcon() {
    await this.page.getByRole("img", { name: "trash-can-icon" }).click();
  }

  async checkResetHighlightsWarningVisibility() {
    await expect(
      this.page
        .locator("div")
        .filter({ hasText: "WarningProceeding with this" })
        .nth(2),
    ).toBeVisible();
  }

  // Toolbar

  async checkToolbarVisibility() {
    await expect(this.page.locator(".absolute > div")).toBeVisible();
  }

  async clickHighlightPenIcon() {
    await this.page.getByRole("img", { name: "highlight icon" }).click();
  }

  async clickUndoIcon() {
    await this.page.getByRole("img", { name: "undo icon" }).click();
  }

  async clickRedoIcon() {
    await this.page.getByRole("img", { name: "redo icon" }).click();
  }

  async clickSelectIcon() {
    await this.page.getByRole("img", { name: "eraser icon" }).click();
  }

  // ConfigBar

  async checkConfigBarVisibility() {
    await expect(
      this.page.getByText(
        "PDFWordRearrangeIndicatorengue Prediction System fnd a Machine Learning-Based",
      ),
    ).toBeVisible();
  }

  async clickPDFButton() {
    await this.page.getByRole("button", { name: "PDF" }).click();
  }

  async clickWordButton() {
    await this.page.getByRole("button", { name: "Word" }).click();
  }

  async clickRearrageButton() {
    await this.page.getByRole("button", { name: "Rearrange" }).click();
  }

  async clickIndicatorButton() {
    await this.page.getByRole("button", { name: "Indicator" }).click();
  }

  async checkHighlightArrangementOverlayVisibility() {
    await expect(
      this.page
        .locator("div")
        .filter({ hasText: "Drag to rearrange highlights" })
        .nth(3),
    ).toBeVisible();
  }

  async checkColorIndicatorVisibility() {
    await this.page.getByRole("listitem").getByText("❚").click();
  }
}

export default EditPage;
