import { Page } from 'playwright';
import { test, expect } from '@playwright/test';

class HomePage {
    page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async goto() {
        await this.page.goto('https://localhost:5173/');
    }

    async clickTrySwiftextButton() {
        await this.page.getByRole('link', { name: 'Try Swiftext for free Arrow' }).click();
    }

    async clickCreateFreeAccountButton() {
        await this.page.getByRole('button', { name: 'Create Free Account arrow-btn' }).click();
    }

    async checkTutorialGifVisibility() {
        await expect(this.page.getByRole('img', { name: 'Dancing Chrome' })).toBeVisible();
    }

}

export default HomePage;