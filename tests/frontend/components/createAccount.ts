import { Page } from 'playwright';
import { test, expect } from '@playwright/test';

class CreateAccount {
    page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async checkCreateAccountModalVisibility(){
        await expect(this.page.getByText('UsernameEmailPasswordShowSign upor login withAlready have an account? Log in!')).toBeVisible();
    }

    async inputSampleUsername(){
        await this.page.getByLabel('Username').click();
        await this.page.getByLabel('Username').fill('monochrome');
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

    async checkSuccessfulAccountCreationOverlayVisibility(){
        await expect(this.page.locator('.fixed').first()).toBeVisible();
    }
}

export default CreateAccount;