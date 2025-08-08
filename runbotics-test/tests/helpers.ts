import { Page } from "@playwright/test";

export default async function loginToRunbotics(
    page: Page,
    { login, password }: { login: string; password: string }
) {
    await page.goto("/login");
    await page.waitForLoadState("load");
    await page.getByLabel("Email Address").fill(login);
    await page.getByLabel("Password").fill(password);

    await page.getByText("Login", { exact: true }).click();
    await page.waitForURL("**/app/processes/collections**");
	await page.waitForLoadState("load");
}