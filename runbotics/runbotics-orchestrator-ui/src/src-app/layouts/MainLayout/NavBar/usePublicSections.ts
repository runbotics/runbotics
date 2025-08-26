import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import CallSplitIcon from '@mui/icons-material/CallSplit';
import ExtensionOutlinedIcon from '@mui/icons-material/ExtensionOutlined';
import HistoryIcon from '@mui/icons-material/History';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import MonitorHeartOutlinedIcon from '@mui/icons-material/MonitorHeartOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ScheduleIcon from '@mui/icons-material/Schedule';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
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
                    authorities: [Role.ROLE_TENANT_ADMIN],
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
                    authorities: [Role.ROLE_TENANT_ADMIN],
                    featureKeys: [FeatureKey.EXTERNAL_ACTION_EDIT],
                },
                {
                    title: translate('Nav.Items.GlobalVariables'),
                    icon: TuneIcon,
                    href: '/app/variables',
                    authorities: [Role.ROLE_TENANT_ADMIN],
                    featureKeys: [FeatureKey.GLOBAL_VARIABLE_READ],
                },
                {
                    title: translate('Nav.Items.Scheduler'),
                    icon: ScheduleIcon,
                    href: '/app/scheduler',
                    authorities: [Role.ROLE_TENANT_ADMIN],
                    featureKeys: [FeatureKey.SCHEDULER_PAGE_READ],
                },
                {
                    title: translate('Nav.Items.History'),
                    icon: HistoryIcon,
                    href: '/app/history',
                    authorities: [Role.ROLE_TENANT_ADMIN],
                    featureKeys: [FeatureKey.HISTORY_READ],
                },
                {
                    title: translate('Nav.Items.Tenants'),
                    icon: BadgeOutlinedIcon,
                    href: '/app/tenants',
                    authorities: [Role.ROLE_ADMIN],
                    featureKeys: [FeatureKey.MANAGE_ALL_TENANTS],
                },
                {
                    title: translate('Nav.Items.Users'),
                    icon: PersonOutlineIcon,
                    href: '/app/users/pending',
                    authorities: [Role.ROLE_ADMIN],
                    featureKeys: [FeatureKey.MANAGE_INACTIVE_USERS],
                },
                {
                    title: translate('Nav.Items.Users'),
                    icon: PersonOutlineIcon,
                    href: '/app/users',
                    authorities: [Role.ROLE_TENANT_ADMIN],
                    featureKeys: [
                        FeatureKey.TENANT_READ_USER,
                        FeatureKey.TENANT_EDIT_USER,
                    ],
                },
                {
                    title: translate('Nav.Items.Monitoring'),
                    icon: MonitorHeartOutlinedIcon,
                    href: '/app/monitoring/grafana',
                    authorities: [Role.ROLE_ADMIN],
                    featureKeys: [FeatureKey.MANAGE_INACTIVE_USERS],
                },
                {
                    title: translate('Nav.Items.AIAssistant'),
                    icon: SmartToyOutlinedIcon,
                    href: '/app/assistant',
                    authorities: [Role.ROLE_USER], // todo: change Role.ROLE_USER to the 'new' ROLE_USER when it appears
                    featureKeys: [FeatureKey.AI_ASSISTANT_ACCESS],
                },
            ],
        },
    ];
};
