import { ActionHandler, DesktopRunRequest, DesktopRunResponse } from "../handler";

export abstract class MultithreadStateless {
    abstract run(request: DesktopRunRequest): Promise<DesktopRunResponse>;

    getType(): string {
        return ActionHandler.StatelessMultithreaded;
    }
}