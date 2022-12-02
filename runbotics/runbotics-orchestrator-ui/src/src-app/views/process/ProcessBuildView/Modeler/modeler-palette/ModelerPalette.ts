import _ from 'lodash';

import { translate } from '#src-app/hooks/useTranslations';

import { BpmnEntries, Entries, InheritedEntries } from './ModelerPalette.types';



export default class ModelerPalette {
    constructor(palette) {
        palette.registerProvider(this);
    }

    /**
     * Pick from default palette entries and/or add custom ones
     *
     * Use this method to quickly generate custom `entries` object
     * for `getPaletteEntries` callback
     *
     * Use `options.inheritedEntries` to include and optionally overwrite
     * default bpmn's palette entries. Use `options.additionalEntries` to
     * add new custom entries.
     */
    protected static createCustomEntries(
        entries: BpmnEntries,
        options: {
            inheritedEntries?: InheritedEntries;
            additionalEntries?: Entries;
        },
    ): Entries {
        const { inheritedEntries, additionalEntries } = options;

        if (!inheritedEntries) return { ...entries, ...additionalEntries };

        const pickedDefaultEntries = Object.fromEntries(
            Object.entries(entries).filter(([key]) => Object.keys(inheritedEntries).includes(key)),
        );

        return {
            // prettier-ignore
            ...(_.defaultsDeep(inheritedEntries, pickedDefaultEntries)),
            ...additionalEntries,
        };
    }

    getPaletteEntries() {
        return function (entries) {
            const customEntries = ModelerPalette.createCustomEntries(entries, {
                // prettier-ignore
                inheritedEntries: {
                    'hand-tool': { title: translate('Palette.HandTool') },
                    'lasso-tool': { title: translate('Palette.LassoTool') },
                    'space-tool': { title: translate('Palette.SpaceTool') },
                    'global-connect-tool': { title: translate('Palette.GlobalConnectTool') },
                    'tool-separator': {},
                    'create.start-event': { title: translate('Palette.Create.StartEvent') },
                    'create.end-event': { title: translate('Palette.Create.EndEvent') },
                    'create.exclusive-gateway': { title: translate('Palette.Create.ExclusiveGateway') },
                    'create.group': { title: translate('Palette.Create.Group') },
                },
            });

            return customEntries;
        };
    }
}

(ModelerPalette as any).$inject = ['palette'];
