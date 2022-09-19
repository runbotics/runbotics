export type Entries = Record<string, object>;
export type InheritedEntryKeys = (keyof Entries)[];

export default class ModelerPalette {
    constructor(palette) {
        palette.registerProvider(this);
    }

    /**
     * Pick from default palette entries and/or add custom ones
     * 
     * Use this method to quickly generate custom `entries` object
     * for `getPaletteEntries` callback
     */
    private static createCustomEntries(
        entries: Entries,
        options: {
            inheritedEntryKeys?: InheritedEntryKeys;
            additionalEntries?: Entries;
        },
    ): Entries {
        const { inheritedEntryKeys, additionalEntries } = options;

        if (!inheritedEntryKeys?.length) return { ...entries, ...additionalEntries };

        const inheritedEntries = Object.fromEntries(
            Object.entries(entries).filter(([key]) => inheritedEntryKeys.includes(key)),
        );
        return { ...inheritedEntries, ...additionalEntries };
    }

    getPaletteEntries(element) {
        return function (entries) {
            const customEntries = ModelerPalette.createCustomEntries(entries, {
                inheritedEntryKeys: [
                    'hand-tool',
                    'lasso-tool',
                    'space-tool',
                    'global-connect-tool',
                    'tool-separator',
                    'create.start-event',
                    'create.end-event',
                    'create.exclusive-gateway',
                    'create.group',
                ],
            });

            return customEntries;
        };
    }
}

// @ts-ignore
ModelerPalette.$inject = ['palette'];
