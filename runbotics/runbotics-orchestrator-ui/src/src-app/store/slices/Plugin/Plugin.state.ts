import { IBpmnAction } from '#src-app/Actions/types';

export interface PluginState {
    pluginBpmnActions: Record<string, IBpmnAction>;
    pluginBpmnActionsMap: Map<string, Record<string, IBpmnAction>>;
    pluginActionsGroupLabelMap: Map<string, (translate: Translate) => string>;
    loadedPlugins: LoadedPlugin[];
}

export type Translate = (
    key: string,
    values?: {
        [key: string]: string | number;
    }
) => string;

export interface LoadedPlugin {
    [key: string]: {
        actions: (translate: Translate) => Record<string, IBpmnAction>;
        actionsGroupLabel?: (translate: Translate) => string;
        translations: {
            en: {
                translation: Record<string, string>;
            };
            pl: {
                translation: Record<string, string>;
            };
        };
    };
}
