import { Locator, Page } from "@playwright/test";

export class AppPage {
    readonly page: Page;
    readonly languageSwitcher: Locator;
    private readonly LANGUAGE_SWITCH_TIMEOUT = 10000;

    constructor(page: Page) {
        this.page = page;
        this.languageSwitcher = page.getByTestId(
            "language-switcher-header-button"
        );
    }

    async switchLanguage(language: "en" | "pl") {
        await this.languageSwitcher.click();
        await this.page
            .getByTestId(`language-switcher-language-${language}`)
            .click();

        if (language === "pl") {
            await this.page.waitForURL("**/pl/**", { timeout: this.LANGUAGE_SWITCH_TIMEOUT });
        } else {
            await this.page.waitForURL(
                (url) => !url.pathname.includes("/pl/"),
                { timeout: this.LANGUAGE_SWITCH_TIMEOUT }
            );
        }

        await this.page.waitForLoadState("networkidle");
    }
}