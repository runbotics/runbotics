import { ActionHandler } from "./utils";
import { DesktopRunRequest } from "./DesktopRunRequest";
import { DesktopRunResponse } from "./DesktopRunResponse";

export abstract class StatefulActionHandler {
    abstract run(
        request: DesktopRunRequest
    ): Promise<DesktopRunResponse>;

    getType(): string {
        return ActionHandler.Stateful;
    }

    abstract tearDown(): Promise<void>;
}
