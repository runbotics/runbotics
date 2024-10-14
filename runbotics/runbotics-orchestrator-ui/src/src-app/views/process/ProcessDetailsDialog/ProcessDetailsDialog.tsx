import React, { SyntheticEvent, useState } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import {
    Box,
    DialogContent,
    Divider,
    IconButton,
    Tab,
    Typography,
} from '@mui/material';

import useTranslations from '#src-app/hooks/useTranslations';

import {
    StyledDialog,
    StyledDialogTitle,
    StyledTabs,
} from './ProcessDetailsDialog.styles';
import {
    ProcessDetailsDialogProps,
    ProcessDetailsTab,
} from './ProcessDetailsDialog.types';
import { AccessTab } from './ProcessDetailsTabs/AccessTab';
import { CredentialsTab } from './ProcessDetailsTabs/CredentialsTab';
import { GeneralInfoTab } from './ProcessDetailsTabs/GeneralInfoTab';
import { SchedulesTab } from './ProcessDetailsTabs/SchedulesTab';

export function ProcessDetailsDialog({
    process,
    isOpen,
    onClose,
}: ProcessDetailsDialogProps) {
    const { translate } = useTranslations();
    const [currentTab, setCurrentTab] = useState<ProcessDetailsTab>(
        ProcessDetailsTab.GENERAL_INFO
    );
    const processDetailsTabs = [
        {
            value: ProcessDetailsTab.GENERAL_INFO,
            label: translate(
                'Component.Tile.Process.DetailsDialog.TabLabel.GeneralInfo'
            ),
        },
        {
            value: ProcessDetailsTab.SCHEDULES,
            label: translate(
                'Component.Tile.Process.DetailsDialog.TabLabel.Schedules'
            ),
        },
        {
            value: ProcessDetailsTab.CREDENTIALS,
            label: translate(
                'Component.Tile.Process.DetailsDialog.TabLabel.Credentials'
            ),
        },
        {
            value: ProcessDetailsTab.ACCESS,
            label: translate(
                'Component.Tile.Process.DetailsDialog.TabLabel.Access'
            ),
        },
    ];

    const handleTabChange = (
        event: SyntheticEvent,
        newValue: ProcessDetailsTab
    ) => {
        setCurrentTab(newValue);
    };

    return (
        <StyledDialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
            <StyledDialogTitle>
                <Typography variant="h3">
                    {translate('Component.Tile.Process.DetailsDialog.Title')}
                </Typography>
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </StyledDialogTitle>
            <DialogContent>
                <Box>
                    <Typography variant="h4" textTransform="none" mb={3}>
                        {process?.name}
                    </Typography>
                    <Typography variant="body1" mb={3}>
                        {process?.description}
                    </Typography>
                </Box>
                <StyledTabs
                    value={currentTab}
                    onChange={handleTabChange}
                    textColor="secondary"
                    indicatorColor="secondary"
                >
                    {processDetailsTabs.map((tab) => (
                        <Tab
                            key={tab.value}
                            label={tab.label}
                            value={tab.value}
                            sx={{ textTransform: 'none' }}
                        />
                    ))}
                </StyledTabs>
                <Divider />
                <GeneralInfoTab value={currentTab} process={process} />
                <SchedulesTab value={currentTab} process={process} />
                <CredentialsTab value={currentTab} process={process} />
                <AccessTab value={currentTab} process={process} />
            </DialogContent>
        </StyledDialog>
    );
}
