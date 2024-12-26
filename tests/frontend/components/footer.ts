import { Page } from 'playwright';
import { test, expect } from '@playwright/test';

class Footer {
    page: Page;

    constructor(page: Page) {
        this.page = page;
    }
}

export default Footer;