import React, { createContext, useEffect, useState, FC, ReactNode } from 'react';

import _ from 'lodash';

import { ThemeType } from '#src-app/utils/constants';

interface Settings {
    direction?: 'ltr' | 'rtl';
    responsiveFontSizes?: boolean;
    theme?: ThemeType;
}

export interface SettingsContextValue {
    settings: Settings;
    saveSettings: (update: Settings) => void;
}

interface SettingsProviderProps {
    settings?: Settings;
    children?: ReactNode;
}

const defaultSettings: Settings = {
    direction: 'ltr',
    responsiveFontSizes: true,
    theme: ThemeType.LIGHT,
};

export const restoreSettings = (): Settings | null => {
    let settings = null;

    try {
        const storedData: string | null = window.localStorage.getItem('settings');

        if (storedData) settings = JSON.parse(storedData);
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
        // If stored data is not a strigified JSON this will fail,
        // that's why we catch the error
    }

    return settings;
};

export const storeSettings = (settings: Settings): void => {
    window.localStorage.setItem('settings', JSON.stringify(settings));
};

const SettingsContext = createContext<SettingsContextValue>({
    settings: defaultSettings,
    saveSettings: () => {},
});

export const SettingsProvider: FC<SettingsProviderProps> = ({ settings, children }) => {
    const [currentSettings, setCurrentSettings] = useState<Settings>(settings || defaultSettings);

    const handleSaveSettings = (update: Settings = {}): void => {
        const mergedSettings = _.merge({}, currentSettings, update);

        setCurrentSettings(mergedSettings);
        storeSettings(mergedSettings);
    };

    useEffect(() => {
        const restoredSettings = restoreSettings();

        if (restoredSettings) setCurrentSettings(restoredSettings);
    }, []);

    useEffect(() => {
        document.dir = currentSettings.direction;
    }, [currentSettings]);

    return (
        <SettingsContext.Provider
            value={{
                settings: currentSettings,
                saveSettings: handleSaveSettings,
            }}
        >
            {children}
        </SettingsContext.Provider>
    );
};

export const SettingsConsumer = SettingsContext.Consumer;

export default SettingsContext;
