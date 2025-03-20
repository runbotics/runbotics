import { DesktopRunRequest } from './DesktopRunRequest';
import { DesktopRunResponse } from './DesktopRunResponse';
import { PluginHandler } from './utils';

export abstract class StatefulStandalonePluginHandler {
    abstract run(
        request: DesktopRunRequest
    ): Promise<DesktopRunResponse | void>;

    getType(): string {
        return PluginHandler.StatefulStandalone;
    }

    abstract tearDown(): Promise<void>;
}
