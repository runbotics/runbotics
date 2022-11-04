import ContactlessIcon from '@mui/icons-material/Contactless';
import ExtensionIcon from '@mui/icons-material/Extension';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

import useTranslations from 'src/hooks/useTranslations';

import { CustomStep } from './CustomSteps.types';

const useInstallSteps = (): CustomStep[] => {
    const { translate } = useTranslations();

    return [
        {
            label: translate('Install.Dialog.Steps.Install'),
            icon: ExtensionIcon,
        },
        {
            label: translate('Install.Dialog.Steps.Connect'),
            icon: ContactlessIcon,
        },
        {
            label: translate('Install.Dialog.Steps.RunFirstProcess'),
            icon: PlayArrowIcon,
        },
    ];
};

export default useInstallSteps;
