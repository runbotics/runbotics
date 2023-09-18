import { ActionHandler, DesktopRunRequest, DesktopRunResponse } from "../handler";

export abstract class MultithreadStatefulActionHandler {
    abstract run(request: DesktopRunRequest): Promise<DesktopRunResponse>;

    getType(): string {
        return ActionHandler.MultithreadStateful;
    }

    abstract tearDown(): Promise<void>;
}