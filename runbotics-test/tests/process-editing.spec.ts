import { test, expect } from '@playwright/test';
import loginToRunbotics from 'helpers';
import { readFileSync } from 'node:fs';
import path from "node:path"

const authFile = path.join(__dirname, '../.auth/user.json');
const authData = JSON.parse(readFileSync(authFile, 'utf-8'));
const login = authData.tenant_admin?.login;
const password = authData.tenant_admin?.password;

if (!login || !password) throw new Error(`Either login or password are not provided for tenant_admin field`)

test('tenant-admin can see the Add Item button translation in process edit view', async ({ page }) => {
	const TEST_PROCESS_NAME ='PW-TEST-RPA-2246';

	await loginToRunbotics(page, authData.tenant_admin);

	await page.goto(`/app/processes?pageSize=12&search=${encodeURIComponent(TEST_PROCESS_NAME)}`);
	await page.waitForLoadState("load");

	await page.getByText(TEST_PROCESS_NAME).click();
	
	await page.locator('g:nth-child(5) > .djs-element > .djs-hit').click();
	
	await page.locator('*#mainActionGrid button:has(svg[data-testid="AddIcon"])').waitFor();

	await page.getByTestId('language-switcher-header-button').click()
	await page.getByTestId('language-switcher-language-pl').click()
	const buttonLabel = await page.getByRole('button', { name: 'Dodaj pozycję' }).textContent();
	expect(buttonLabel).toContain('Dodaj');
});
