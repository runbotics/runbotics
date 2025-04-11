import { DesktopRunRequest } from './DesktopRunRequest';
import { DesktopRunResponse } from './DesktopRunResponse';
import { PluginHandler } from './utils';

export abstract class StatelessStandalonePluginHandler {
    abstract run(
        request: DesktopRunRequest
    ): Promise<DesktopRunResponse | void>;

    getType(): string {
        return PluginHandler.StatelessStandalone;
    }
}
