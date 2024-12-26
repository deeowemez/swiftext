import { Page } from 'playwright';
import { test, expect } from '@playwright/test';

class FilesPage {
    page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async goto() {
        await this.page.goto('https://localhost:5173/files');
    }

    async checkHeaderVisibility() {
        await expect(this.page.getByText('SwiftextHomeFilesLog InSign Up')).toBeVisible();
    }

    async checkSampleFileVisibility() {
        await expect(this.page.getByText('thumbnail prevCSUS-PAPER.pdf6')).toBeVisible();
    }

    async clickSampleFile(){
        await this.page.getByText('thumbnail prevCSUS-PAPER.pdf6').click();
    }

    async clickUploadButton() {
        await this.page.getByRole('img', { name: 'upload svg' }).click();
    }

}

export default FilesPage;