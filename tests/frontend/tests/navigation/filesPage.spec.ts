import { test } from '../../utils/fixture';

test.describe('Navigate to Files Page', () => {

    test('Navigate to Files Page from Home Page', async ({ homePage }) => {
        await homePage.clickTrySwiftextButton();
    })

    test('Navigate to Files Page from Header', async ({ header }) => {
        await header.clickFilesLink();
    })

    test.afterEach(async ({ filesPage }) => {
        await filesPage.checkURL();
        await filesPage.checkUploadButtonVisibility();
        await filesPage.checkHeaderVisibility();
    })
})