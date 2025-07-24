import { useContext } from 'react';

import SettingsContext, { SettingsContextValue } from '#src-app/contexts/SettingsContext';

const useSettings = (): SettingsContextValue => useContext(SettingsContext);

export default useSettings;
