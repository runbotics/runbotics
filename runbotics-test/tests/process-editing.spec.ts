import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/loginPage";
import { ProcessesCollectionsPage } from "../pages/processesCollectionsPage";
import { loadAuthData } from "../utils/auth.utils";

const authData = loadAuthData();
const email = authData.tenant_admin?.email;
const password = authData.tenant_admin?.password;

if (!email || !password)
    throw new Error(
        `Either email or password are not provided for tenant_admin field`
    );
test.describe("Process editing & language switcher", () => {
    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login({
            email: authData.tenant_admin.email,
            password: authData.tenant_admin.password,
        });
        await loginPage.waitForLoginSuccess();
    });
    
    test("tenant-admin can see the Add Item button translation in process edit view", async ({
        page,
    }) => {
        const TEST_PROCESS_NAME = "PW-TEST-RPA-2246";
        const processesCollectionsPage = new ProcessesCollectionsPage(page);
        await processesCollectionsPage.switchLanguage("en");
        const processesPage = await processesCollectionsPage.goToProcessesPage();
        await processesPage.searchForProcess(TEST_PROCESS_NAME);
        await processesPage.selectProcess(TEST_PROCESS_NAME);
    
        // TODO: Add ProcessBuilderPage and change the rest of the test that it uses it
        // https://all41.atlassian.net/browse/RPA-2424
    
        await page.locator("g:nth-child(5) > .djs-element > .djs-hit").click();
    
        await page
            .locator('*#mainActionGrid button:has(svg[data-testid="AddIcon"])')
            .waitFor();
    
        await page.getByTestId("language-switcher-header-button").click();
        await page.getByTestId("language-switcher-language-pl").click();
        const buttonLabel = await page
            .getByRole("button", { name: "Dodaj pozycję" })
            .textContent();
        expect(buttonLabel).toContain("Dodaj");
    });
    
    test("should display a confirmation dialog when there are unsaved changes", async ({ page }) => {
        const collectionsPage = new ProcessesCollectionsPage(page);
        const processesPage = await collectionsPage.goToProcessesPage();
        await processesPage.goto({ search: "PW-TEST-RPA-2406" });
        await processesPage.selectProcess("PW-TEST-RPA-2406");
    
        await expect(page.getByTestId("language-switcher-header-button")).toBeVisible();
        await page.click('[data-testid="language-switcher-header-button"]');
        await page.click('[data-testid="language-switcher-language-en"]');
        await page.getByText("XML", { exact: true }).click();
        await page.waitForSelector('text=Convert JSON to XML', { state: 'visible', timeout: 5000 });
        await page.getByText("Convert JSON to XML", { exact: true }).click();
    
        await page.click("g.djs-group:nth-of-type(2)");
    
        await page.click('[data-testid="language-switcher-header-button"]');
        await page.click('[data-testid="language-switcher-language-pl"]');
    
        await expect(page.locator('text=All unsaved changes process wizard changes will be lost.')).toBeVisible();
        await expect(page.locator('button:has-text("Ok")')).toBeVisible();
        await expect(page.locator('button:has-text("Cancel")')).toBeVisible();
    });
});
