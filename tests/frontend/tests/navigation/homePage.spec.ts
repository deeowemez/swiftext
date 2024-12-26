import { test } from '../../utils/fixture';
import { expect } from '@playwright/test';

test.describe('Navigate to Company Information Page', () => {

    test('Navigate to Company Information Page from Header', async ({ header }) => {
        await header.clickCompanyDir();
        await header.clickAbout();
    })

    test('Navigate to Company Information Page from Footer', async ({ footer }) => {
        await footer.clickAboutLink();
    })

    test.afterEach(async ({ page }) => {
        expect(async () => {
            await expect(page).toHaveURL('https://thinkingmachin.es/about', {
                timeout: 500,
            });
            await expect(page.getByText('We are on a mission to enable')).toBeVisible();
        }).toPass()
    })

})