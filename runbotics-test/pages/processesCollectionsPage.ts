import { Locator, Page } from "@playwright/test";
import { AppPage } from "./appPage";
import { ProcessesPage } from "./processesPage";

export class ProcessesCollectionsPage extends AppPage {
    readonly processesNavButton: Locator;
    readonly collectionsNavButton: Locator;
    readonly processesNavButtonTestId = "procesTabs-tab-processes";
    readonly collectionsNavButtonTestId = "procesTabs-tab-collections";

    constructor(page: Page) {
        super(page);
        this.processesNavButton = page.getByTestId(
            this.processesNavButtonTestId
        );
        this.collectionsNavButton = page.getByTestId(
            this.collectionsNavButtonTestId
        );
    }

    async goToProcessesPage() {
        await this.processesNavButton.click();

        await this.page.waitForSelector(
            `[data-testid=${this.processesNavButtonTestId}][aria-selected="true"]`
        );

        await this.page.waitForLoadState("load");
        return new ProcessesPage(this.page);
    }
}
