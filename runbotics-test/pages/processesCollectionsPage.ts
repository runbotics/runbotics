import { Locator, Page } from "@playwright/test";
import { AppPage } from "./appPage";
import { ProcessesPage } from "./processesPage";

export class ProcessesCollectionsPage extends AppPage {
    readonly processesNavButton: Locator;
    readonly collectionsNavButton: Locator;

    constructor(page: Page) {
        super(page);
        this.processesNavButton = page.getByTestId("procesTabs-tab-processes");
        this.collectionsNavButton = page.getByTestId(
            "procesTabs-tab-collections"
        );
    }

    async goToProcessesPage() {
        await this.processesNavButton.click();
        return new ProcessesPage(this.page);
    }
}
