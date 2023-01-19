import { Injectable } from "@nestjs/common";
import * as winax from "winax";
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
    private sessions: Record<string, any> = {};
    private openedFiles: Record<string, any> = {};
    constructor() {
        super();
    }

    async open(
        input: PowerPointOpenActionInput
    ): Promise<PowerPointOpenActionOutput> {
        this.sessions["session"] = new winax.Object("PowerPoint.Application", {
            activate: true,
        });

        this.sessions["session"].Presentations.Open(input.filePath);

        this.openedFiles["session"] = input.filePath;
    }

    async insertSlide(
        input: PowerPointInsertActionInput
    ): Promise<PowerPointInsertActionOutput> {
        this.sessions["session"].ActivePresentation.Slides.InsertFromFile(
            input.filePath,
            0
        );
    }

    async saveAs(
        input: PowerPointSaveActionInput
    ): Promise<PowerPointSaveActionOutput> {
        this.sessions["session"].ActivePresentation.SaveAs(
            this.openedFiles["session"]
        );
    }

    async close(
        input: PowerPointCloseActionInput
    ): Promise<PowerPointCloseActionOutput> {
        this.sessions["session"].Quit();
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
                return this.close(request.input);
            default:
                throw new Error("Action not found");
        }
    }

    async tearDown() {
        // throw new Error('Method not implemented.');
    }
}
