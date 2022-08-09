import { DesktopRunRequest } from "./DesktopRunRequest";
import { DesktopRunResponse } from "./DesktopRunResponse";

export abstract class StatelessActionHandler {
    abstract run(
        request: DesktopRunRequest<any>
    ): Promise<DesktopRunResponse<any>>;

    getType() {
        return "StatelessActionHandler";
    }
}
