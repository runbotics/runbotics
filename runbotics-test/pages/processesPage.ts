import { Locator, Page } from "@playwright/test";
import { AppPage } from "./appPage";

export class ProcessesPage extends AppPage {
    readonly searchInput: Locator;

    constructor(page: Page) {
        super(page);
        this.searchInput = page.getByTestId("process-search-field");
    }

    async goto(options: { pageSize?: number; search?: string } = {}) {
        const params = new URLSearchParams();
        if (options.pageSize)
            params.set("pageSize", options.pageSize.toString());
        if (options.search) params.set("search", options.search);

        const url = `/app/processes${
            params.toString() ? "?" + params.toString() : ""
        }`;
        await this.page.goto(url);
        await this.page.waitForLoadState("load");
    }

    async searchForProcess(processName: string) {
        await this.searchInput.fill(processName);
        await this.searchInput.press("Enter");
    }

    async selectProcess(processName: string) {
        await this.page.getByText(processName, { exact: true }).click();
    }

    async waitForProcessInResults(processName: string) {
        await this.page.getByText(processName, { exact: true }).waitFor();
    }
}
