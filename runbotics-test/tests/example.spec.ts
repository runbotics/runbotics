import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import path from "node:path"

const authFile = path.join(__dirname, '../.auth/user.json');
const authData = JSON.parse(readFileSync(authFile, 'utf-8'));
const login = authData.tenant_admin?.login;
const password = authData.tenant_admin?.password;

if (!login || !password) throw new Error(`Either login or password are not provided for tenant_admin field`)

test('tenant-admin can login', async ({ page }) => {
	await page.goto('/login');
	await page.waitForLoadState("load");
	await page.getByLabel('Email Address').fill(login);
	await page.getByLabel('Password').fill(password);

	await page.getByText('Login', { exact: true }).click();

	await page.waitForURL("/app/processes/collections**");
	await page.waitForLoadState("load");

	expect(await page.title()).toMatch(/RunBotics/i)
});

test('tenant-admin can go to processForTests', async ({ page }) => {
	const TEST_PROCESS_NAME ='PW-TEST-RPA-2246';
	await page.goto('/login');
	await page.waitForLoadState("load");
	await page.getByLabel('Email Address').fill(login);
	await page.getByLabel('Password').fill(password);

	await page.getByText('Login', { exact: true }).click();

	await page.waitForURL("**/app/processes/collections**");
	await page.waitForLoadState("load");
	// await page.getByTestId('procesTabs-tab-processes').click();

	await page.goto(`/app/processes?pageSize=12&search=${encodeURIComponent(TEST_PROCESS_NAME)}`);
	await page.waitForLoadState("load");

	await page.getByText(TEST_PROCESS_NAME).click();
	
	await page.locator('g:nth-child(5) > .djs-element > .djs-hit').click();
	
	const buttonText = (await page.locator('*#mainActionGrid button:has(svg[data-testid="AddIcon"])').innerText()).trim();
	// expect(buttonText).toEqual('ADD ITEM');
	console.log(buttonText);
	await page.getByTestId('language-switcher-header-button').click()
	await page.getByTestId('language-switcher-language-pl').click()
	await page.getByRole('button', { name: 'Dodaj pozycję' }).innerHTML()

});
