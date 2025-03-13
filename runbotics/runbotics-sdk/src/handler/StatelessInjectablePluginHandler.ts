import { DesktopRunRequest } from './DesktopRunRequest';
import { DesktopRunResponse } from './DesktopRunResponse';
import { PluginHandler } from './utils';

export abstract class StatelessInjectablePluginHandler {
    abstract run(
        request: DesktopRunRequest,
        ctx: unknown
    ): Promise<DesktopRunResponse | void>;

    getType(): string {
        return PluginHandler.StatelessInjectable;
    }
}
