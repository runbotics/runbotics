import { test, expect } from '@playwright/test';
import {LoginPage} from "../pages/loginPage";
import {ProcessesCollectionsPage} from "../pages/processesCollectionsPage";
import { loadAuthData } from "../utils/auth.utils";

const authData = loadAuthData();
test.describe('LanguageSwitcher E2E', () => {
    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login({ email: authData.tenant_admin.email, password: authData.tenant_admin.password });
        await loginPage.waitForLoginSuccess();

        const collectionsPage = new ProcessesCollectionsPage(page);
        await collectionsPage.goToProcessesPage();

        const processesPage = await collectionsPage.goToProcessesPage();
        await processesPage.goto({search: 'xml'});
        await processesPage.selectProcess('xml');

        await expect(page.locator('[data-testid="language-switcher-header-button"]')).toBeVisible();
    });

    test('powinien pokazać dialog potwierdzenia, gdy są niezapisane zmiany', async ({ page }) => {
        await page.getByText('XML', {exact: true}).click();
        await page.waitForSelector('text=Convert JSON to XML', { state: 'visible', timeout: 5000 });
        await page.getByText('Convert JSON to XML', {exact: true}).click();
        await page.click('g:nth-child(4) > .djs-element');
        await page.click('[data-testid="language-switcher-header-button"]');
        await page.click("[data-testid='language-switcher-language-pl']");
        await expect(page.locator('text=All unsaved changes process wizard changes will be lost.')).toBeVisible();
        await expect(page.locator('button:has-text("Ok")')).toBeVisible();
        await expect(page.locator('button:has-text("Cancel")')).toBeVisible();
    });
});
