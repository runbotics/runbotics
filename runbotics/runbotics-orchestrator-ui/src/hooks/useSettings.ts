import { useContext } from 'react';
import SettingsContext from 'src/contexts/SettingsContext';
import type { SettingsContextValue } from 'src/contexts/SettingsContext';

const useSettings = (): SettingsContextValue => useContext(SettingsContext);

export default useSettings;
