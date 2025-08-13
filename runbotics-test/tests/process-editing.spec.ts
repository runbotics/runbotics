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

test("tenant-admin can see the Add Item button translation in process edit view", async ({
    page,
}) => {
    const TEST_PROCESS_NAME = "PW-TEST-RPA-2246";

    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login({
        email: authData.tenant_admin.email,
        password: authData.tenant_admin.password,
    });
    await loginPage.waitForLoginSuccess();

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
