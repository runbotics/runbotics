import { DesktopRunRequest } from "./DesktopRunRequest";
import { DesktopRunResponse } from "./DesktopRunResponse";

export abstract class StatefulActionHandler {
    abstract run(
        request: DesktopRunRequest<any>
    ): Promise<DesktopRunResponse<any>>;

    getType() {
        return "StatefulActionHandler";
    }

    abstract tearDown(): Promise<void>;
}
