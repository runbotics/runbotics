import { ActionHandler, DesktopRunRequest, DesktopRunResponse } from "../handler";

export abstract class MultithreadStateful {
    abstract run(request: DesktopRunRequest): Promise<DesktopRunResponse>;

    getType(): string {
        return ActionHandler.StatefulMultithreaded;
    }

    abstract tearDown(): Promise<void>;
}