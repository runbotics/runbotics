import { Locator, Page } from "@playwright/test";

export class AppPage {
    readonly page: Page;
    readonly languageSwitcher: Locator;

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
            await this.page.waitForURL("**/pl/**", { timeout: 10000 });
        } else {
            await this.page.waitForURL(
                (url) => !url.pathname.includes("/pl/"),
                { timeout: 10000 }
            );
        }

        await this.page.waitForLoadState("networkidle");
    }
}
