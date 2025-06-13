import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import path from "node:path"

const authFile = path.join(__dirname, '../.auth/user.json');
const authData = JSON.parse(readFileSync(authFile, 'utf-8'))
const login = authData.login;
const password = authData.password;

test('can login', async ({ page }) => {
	await page.goto('/login');
	await page.waitForLoadState("load");
	await page.getByLabel('Email Address').fill(login)
	await page.getByLabel('Password').fill(password)

	await page.getByText('Login', { exact: true }).click()

	await page.waitForURL("/app/processes/collections**");
	await page.waitForLoadState("load");

	await page.getByText("[AS] Test parent").waitFor();

	expect(await page.title()).toMatch(/Collections/)
});