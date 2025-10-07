import { Locator, Page } from "@playwright/test";

export class LoginPage {
    readonly page: Page;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly loginGuestButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.emailInput = page.getByLabel("Email Address");
        this.passwordInput = page.getByLabel("Password");
        this.loginButton = page.getByText("Login", { exact: true });
        this.loginGuestButton = page.getByText("Login as a Guest", { exact: true });
    }

    async goto() {
        this.page.goto("/login");
    }

    async login({ email, password }: { email: string; password: string }) {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }
    
    async loginGuest() {
        await this.loginGuestButton.click();
    }
    
    async waitForLoginGuestSuccess() {
        await this.page.waitForURL("**/app/processes/**");
    }

    async waitForLoginSuccess() {
        await this.page.waitForURL("**/app/processes/collections**");
    }
}
