import { DesktopRunRequest } from "./DesktopRunRequest";
import { DesktopRunResponse } from "./DesktopRunResponse";

export abstract class StatefulActionHandler {
    abstract run(
        request: DesktopRunRequest
    ): Promise<DesktopRunResponse>;

    abstract tearDown(): Promise<void>;
}
