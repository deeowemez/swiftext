import { Page } from 'playwright';
import { test, expect } from '@playwright/test';

class Login {
    page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async checkLoginModalVisibility(){
        await expect(this.page.getByText('EmailPasswordShowLoginor')).toBeVisible();
    }
    
    async inputSampleEmail(){
        await this.page.getByLabel('Email').click();
        await this.page.getByLabel('Email').fill('monochrome@gmail.com');
    }

    async inputSamplePassword(){
        await this.page.getByLabel('Password').click();
        await this.page.getByLabel('Password').fill('monochrome');
        await this.page.getByRole('button', { name: 'Show' }).click();
    }

    async clickLoginButton(){
        await this.page.getByRole('button', { name: 'Show' }).click();
        await this.page.getByRole('button', { name: 'Login' }).click();
    }

    async checkLoginSuccessfulOverlayVisibility(){
        await expect(this.page.locator('.fixed').first()).toBeVisible();
    }

}

export default Login;