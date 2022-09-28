import CallSplitIcon from '@mui/icons-material/CallSplit';
import ExtensionIcon from '@mui/icons-material/Extension';
import TuneIcon from '@mui/icons-material/Tune';
import HistoryIcon from '@mui/icons-material/History';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { FeatureKey, Role } from 'runbotics-common';
import { Command as CommandIcon } from 'react-feather';
import useTranslations from 'src/hooks/useTranslations';
import { Section } from './Navbar.types';

export const usePublicSections = (): Section[] => {
    const { translate } = useTranslations();

    return [
        {
            subheader: '',
            id: 'main',
            items: [
                {
                    title: translate('Nav.Items.Processes'),
                    icon: CallSplitIcon,
                    href: '/app/processes',
                    featureKeys: [FeatureKey.PROCESS_READ],
                },
                {
                    title: translate('Nav.Items.Bots'),
                    icon: ExtensionIcon,
                    href: '/app/bots',
                    authorities: [Role.ROLE_ADMIN],
                    featureKeys: [FeatureKey.BOT_READ],
                },
                {
                    title: translate('Nav.Items.Actions'),
                    icon: CommandIcon,
                    href: '/app/actions',
                    authorities: [Role.ROLE_ADMIN],
                    featureKeys: [FeatureKey.EXTERNAL_ACTION_READ],
                },
                {
                    title: translate('Nav.Items.GlobalVariables'),
                    icon: TuneIcon,
                    href: '/app/variables',
                    authorities: [Role.ROLE_ADMIN],
                    featureKeys: [FeatureKey.GLOBAL_VARIABLE_READ],
                },
                {
                    title: translate('Nav.Items.Scheduler'),
                    icon: ScheduleIcon,
                    href: '/app/scheduler',
                    authorities: [Role.ROLE_ADMIN],
                    featureKeys: [FeatureKey.SCHEDULER_PAGE_READ],
                },
                {
                    title: translate('Nav.Items.History'),
                    icon: HistoryIcon,
                    href: '/app/history',
                    authorities: [Role.ROLE_ADMIN],
                    featureKeys: [FeatureKey.HISTORY_READ],
                },
            ],
        },
    ];
};