import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/loginPage";
import { loadAuthData } from "../utils/auth.utils";

const authData = loadAuthData();
const email = authData.tenant_admin?.email;
const password = authData.tenant_admin?.password;

if (!email || !password)
    throw new Error(
        `Either email or password are not provided for tenant_admin field`
    );

test("tenant-admin can login", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login({
        email: authData.tenant_admin.email,
        password: authData.tenant_admin.password,
    });
    await loginPage.waitForLoginSuccess();

    expect(await page.title()).toMatch(/RunBotics/i);
});

test('guest can login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginGuest();
    await loginPage.waitForLoginSuccess();

    expect(await page.title()).toMatch(/Process Details/i);
});
