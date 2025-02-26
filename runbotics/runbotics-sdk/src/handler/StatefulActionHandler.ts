import { ActionHandler, PLUGIN_SERVICE, PluginService } from "./utils";
import { DesktopRunRequest } from "./DesktopRunRequest";
import { DesktopRunResponse } from "./DesktopRunResponse";

export abstract class StatefulActionHandler {
    [PLUGIN_SERVICE]?: PluginService;

    abstract run(
        request: DesktopRunRequest
    ): Promise<DesktopRunResponse | void>;

    getType(): string {
        return ActionHandler.Stateful;
    }

    abstract tearDown(): Promise<void>;
}
