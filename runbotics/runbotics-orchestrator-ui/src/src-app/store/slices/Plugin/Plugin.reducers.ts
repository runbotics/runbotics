import { PayloadAction } from '@reduxjs/toolkit';

import i18next from 'i18next';

import { languages } from '#src-app/translations/translations';

import { PluginState, Translate } from './Plugin.state';

export const setPluginBpmnActions = (
    state: PluginState,
    action: PayloadAction<{
        translate: Translate;
    }>
) => {
    const { loadedPlugins } = state;
    const { translate } = action.payload;

    const pluginActionsGroupLabelMap = new Map();

    let pluginBpmnActions = {};
    const pluginBpmnActionsMap = loadedPlugins.reduce(
        (acc: PluginState['pluginBpmnActionsMap'], loadedPlugin) => {
            const entries = Object.entries(loadedPlugin);
            for (const [pluginKey, { actions, actionsGroupLabel, translations }] of entries) {
                const en = languages[0];
                const pl = languages[1];
                const ns = 'translation';

                i18next.addResourceBundle(en, ns, translations[en][ns], true);
                i18next.addResourceBundle(pl, ns, translations[pl][ns], true);

                if (actionsGroupLabel) {
                    pluginActionsGroupLabelMap.set(pluginKey, actionsGroupLabel);
                }

                pluginBpmnActions = {
                    ...pluginBpmnActions,
                    ...actions(translate),
                };

                const existingActions = acc.get(pluginKey);
                if (!existingActions) {
                    acc.set(pluginKey, { ...actions(translate) });
                    continue;
                }

                acc.set(pluginKey, {
                    ...existingActions,
                    ...actions(translate),
                });
            }

            return acc;
        },
        new Map()
    );

    state.pluginBpmnActions = pluginBpmnActions;
    state.pluginBpmnActionsMap = pluginBpmnActionsMap;
    state.pluginActionsGroupLabelMap = pluginActionsGroupLabelMap;
};
