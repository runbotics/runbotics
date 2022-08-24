import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import * as winax from "winax";
import { DesktopRunRequest } from "runbotics-sdk";
import { StatefulActionHandler } from "runbotics-sdk";
import { StatelessActionHandler } from "runbotics-sdk";
import { DesktopRunResponse } from "runbotics-sdk";

export type PowerPointActionRequest<I> = DesktopRunRequest<any> & {
    script:
        | "desktop.powerpoint.open"
        | "desktop.powerpoint.save"
        | "desktop.powerpoint.insert"
        | "desktop.powerpoint.close";
};

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

// TODO add close action
@Injectable()
class PowerPointAutomation extends StatefulActionHandler {
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

    async run(
        request: DesktopRunRequest<any>
    ): Promise<DesktopRunResponse<any>> {
        const powerpointAction: PowerPointActionRequest<any> =
            request as PowerPointActionRequest<any>;
        let output: any = {};
        switch (powerpointAction.script) {
            case "desktop.powerpoint.open":
                output = await this.open(powerpointAction.input);
                break;
            case "desktop.powerpoint.insert":
                output = await this.insertSlide(powerpointAction.input);
                break;
            case "desktop.powerpoint.save":
                output = await this.saveAs(powerpointAction.input);
                break;
            case "desktop.powerpoint.close":
                output = await this.close(powerpointAction.input);
                break;
            default:
                throw new Error("Action not found");
        }

        return {
            status: "ok",
            output: output,
        };
    }

    async tearDown() {
        // throw new Error('Method not implemented.');
    }
}

export default PowerPointAutomation;
