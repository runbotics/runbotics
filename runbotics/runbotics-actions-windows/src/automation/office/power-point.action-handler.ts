import { Injectable } from "@nestjs/common";
import { DesktopRunRequest, StatefulActionHandler } from "runbotics-sdk";

export type PowerPointActionRequest =
| DesktopRunRequest<'powerpoint.open', PowerPointOpenActionInput>
| DesktopRunRequest<'powerpoint.save', PowerPointSaveActionInput>
| DesktopRunRequest<'powerpoint.insert', PowerPointInsertActionInput>
| DesktopRunRequest<'powerpoint.close', PowerPointCloseActionInput>;

export type PowerPointOpenActionInput = {
    filePath: string;
};
export type PowerPointOpenActionOutput = any;

export type PowerPointInsertActionInput = {
    filePath: string;
};
export type PowerPointInsertActionOutput = any;

export type PowerPointSaveActionInput = {};
export type PowerPointSaveActionOutput = any;

export type PowerPointCloseActionInput = {};
export type PowerPointCloseActionOutput = any;

@Injectable()
export default class PowerPointActionHandler extends StatefulActionHandler {
    private session = null;
    private openedFiles = null;

    constructor() {
        super();
    }

    async open(
        input: PowerPointOpenActionInput
    ): Promise<PowerPointOpenActionOutput> {
        if (process.platform !== 'win32') {
            throw new Error('PowerPoint actions can be run only on Windows bot');
        }
        const winax = await import('winax');

        this.session = new winax.Object("PowerPoint.Application", {
            activate: true,
        });

        this.session.Presentations.Open(input.filePath);

        this.openedFiles = input.filePath;
    }

    async insertSlide(
        input: PowerPointInsertActionInput
    ): Promise<PowerPointInsertActionOutput> {
        this.isApplicationOpen();
        this.session.ActivePresentation.Slides.InsertFromFile(
            input.filePath,
            0
        );
    }

    async saveAs(
        input: PowerPointSaveActionInput
    ): Promise<PowerPointSaveActionOutput> {
        this.isApplicationOpen();
        this.session.ActivePresentation.SaveAs(this.openedFiles);
    }

    async close(): Promise<PowerPointCloseActionOutput> {
        this.session?.Quit();
        this.session = null;
        this.openedFiles = null;
    }

    private isApplicationOpen() {
        if (!this.session) {
            throw new Error('Use open application action before');
        }
    }

    run(request: PowerPointActionRequest) {
        switch (request.script) {
            case "powerpoint.open":
                return this.open(request.input);
            case "powerpoint.insert":
                return this.insertSlide(request.input);
            case "powerpoint.save":
                return this.saveAs(request.input);
            case "powerpoint.close":
                return this.close();
            default:
                throw new Error("Action not found");
        }
    }

    async tearDown() {
        await this.close();
    }
}
