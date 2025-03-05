import { DesktopRunRequest } from './DesktopRunRequest';
import { DesktopRunResponse } from './DesktopRunResponse';
import { PluginHandler } from './utils';

export abstract class StatelessInjectablePluginHandler {
    abstract run(
        ctx: unknown,
        request: DesktopRunRequest
    ): Promise<DesktopRunResponse | void>;

    getType(): string {
        return PluginHandler.StatelessInjectable;
    }
}
