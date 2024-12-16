import CallSplitIcon from '@mui/icons-material/CallSplit';
import ExtensionOutlinedIcon from '@mui/icons-material/ExtensionOutlined';
import HistoryIcon from '@mui/icons-material/History';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ScheduleIcon from '@mui/icons-material/Schedule';
import TuneIcon from '@mui/icons-material/Tune';
import { Command as CommandIcon } from 'react-feather';
import { FeatureKey, Role } from 'runbotics-common';

import useTranslations from '#src-app/hooks/useTranslations';

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
                    href: '/app/processes/collections',
                    featureKeys: [FeatureKey.PROCESS_LIST_READ],
                },
                {
                    title: translate('Nav.Items.Bots'),
                    icon: ExtensionOutlinedIcon,
                    href: '/app/bots',
                    authorities: [Role.ROLE_ADMIN, Role.ROLE_TENANT_ADMIN],
                    featureKeys: [FeatureKey.BOT_READ],
                },
                {
                    title: translate('Nav.Items.Credentials'),
                    icon: LockOutlinedIcon,
                    href: '/app/credentials/collections',
                    featureKeys: [FeatureKey.CREDENTIALS_PAGE_READ],
                },
                {
                    title: translate('Nav.Items.Actions'),
                    icon: CommandIcon,
                    href: '/app/actions',
                    authorities: [Role.ROLE_ADMIN, Role.ROLE_TENANT_ADMIN],
                    featureKeys: [FeatureKey.EXTERNAL_ACTION_EDIT],
                },
                {
                    title: translate('Nav.Items.GlobalVariables'),
                    icon: TuneIcon,
                    href: '/app/variables',
                    authorities: [Role.ROLE_ADMIN, Role.ROLE_TENANT_ADMIN],
                    featureKeys: [FeatureKey.GLOBAL_VARIABLE_READ],
                },
                {
                    title: translate('Nav.Items.Scheduler'),
                    icon: ScheduleIcon,
                    href: '/app/scheduler',
                    authorities: [Role.ROLE_ADMIN, Role.ROLE_TENANT_ADMIN],
                    featureKeys: [FeatureKey.SCHEDULER_PAGE_READ],
                },
                {
                    title: translate('Nav.Items.History'),
                    icon: HistoryIcon,
                    href: '/app/history',
                    authorities: [Role.ROLE_ADMIN, Role.ROLE_TENANT_ADMIN],
                    featureKeys: [FeatureKey.HISTORY_READ],
                },
            ],
        },
    ];
};
