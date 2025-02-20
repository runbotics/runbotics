import { DesktopRunRequest } from './DesktopRunRequest';
import { DesktopRunResponse } from './DesktopRunResponse';
import { PluginHandler } from './utils';

export abstract class StatelessInjectablePluginHandler {
    abstract run<This>(
        ctx: This,
        request: DesktopRunRequest,
    ): Promise<DesktopRunResponse | void>;

    getType(): string {
        return PluginHandler.StatelessInjectable;
    }
}
