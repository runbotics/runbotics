import { Locator, Page } from "@playwright/test";
import { AppPage } from "./appPage";
import { ProcessesPage } from "./processesPage";

export class ProcessesCollectionsPage extends AppPage {
    readonly processesNavButton: Locator;
    readonly collectionsNavButton: Locator;
    readonly ProcessesNavButtonTestId = "procesTabs-tab-processes";
    readonly CollectionsNavButtonTestId = "procesTabs-tab-collections";

    constructor(page: Page) {
        super(page);
        this.processesNavButton = page.getByTestId(
            this.ProcessesNavButtonTestId
        );
        this.collectionsNavButton = page.getByTestId(
            this.CollectionsNavButtonTestId
        );
    }

    async goToProcessesPage() {
        await this.processesNavButton.click();

        await this.page.waitForSelector(
            `[data-testid=${this.ProcessesNavButtonTestId}][aria-selected="true"]`
        );

        await this.page.waitForLoadState("load");
        return new ProcessesPage(this.page);
    }
}
