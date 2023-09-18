import { ActionHandler, DesktopRunRequest, DesktopRunResponse } from "../handler";

export abstract class MultithreadStatelessActionHandler {
    abstract run(request: DesktopRunRequest): Promise<DesktopRunResponse>;

    getType(): string {
        return ActionHandler.MultithreadStateless;
    }
}