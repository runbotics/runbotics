import { ActionHandler, PLUGIN_SERVICE, PluginService } from './utils';
import { DesktopRunRequest } from "./DesktopRunRequest";
import { DesktopRunResponse } from "./DesktopRunResponse";

export abstract class StatelessActionHandler {
    [PLUGIN_SERVICE]?: PluginService;

    abstract run(
        request: DesktopRunRequest
    ): Promise<DesktopRunResponse>;

    getType(): string {
        return ActionHandler.Stateless;
    }
}
