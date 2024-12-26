import { Page } from 'playwright';
import { test, expect } from '@playwright/test';

class Header {
    page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async gotoHomePage() {
        await this.page.goto('https://localhost:5173/');
    }

    async clickLogo() {
        await this.page.getByRole('banner').getByRole('link', { name: 'Swiftext Logo Swiftext' }).click();
    }

    async clickHomeLink() {
        await this.page.getByRole('link', { name: 'Home' }).click();
    }

    async clickFilesLink() {
        await this.page.getByRole('link', { name: 'Files' }).click();
    }

    async clickLogInButton() {
        await this.page.getByRole('button', { name: 'Log In' }).click();
    }

    async clickSingUpButton() {
        await this.page.getByRole('button', { name: 'Sign Up' }).click();
    }

    async checkSampleNameVisibility(){
        await expect(this.page.getByText('Hi, monochrome!')).toBeVisible();
    }

    async clickLogOutButton(){
        await this.page.getByRole('button', { name: 'Log Out' }).click();
    }

}

export default Header;