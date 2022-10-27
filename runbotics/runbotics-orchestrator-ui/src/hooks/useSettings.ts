import { useContext } from 'react';

import SettingsContext, { SettingsContextValue } from 'src/contexts/SettingsContext';

const useSettings = (): SettingsContextValue => useContext(SettingsContext);

export default useSettings;
