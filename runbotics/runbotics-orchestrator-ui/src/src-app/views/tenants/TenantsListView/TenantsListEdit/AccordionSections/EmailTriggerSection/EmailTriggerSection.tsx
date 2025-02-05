import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { Box, Typography } from '@mui/material';

import { Tenant } from 'runbotics-common';

import Accordion from '#src-app/components/Accordion';
import useTranslations from '#src-app/hooks/useTranslations';
import InfoButtonTooltip from '#src-app/views/process/ProcessBuildView/Modeler/ActionFormPanel/widgets/InfoTooltip/InfoButtonTooltip';

import { EmailTriggerWhitelistInput } from './EmailTriggerWhitelistInput';
import { EmailTriggerWhitelistTable } from './EmailTriggerWhitelistTable';

interface EmailTriggerSectionProps {
    tenant: Tenant;
    setTenant: Dispatch<SetStateAction<Tenant>>;
}

export const EmailTriggerSection = ({
    tenant: { emailTriggerWhitelist },
    setTenant,
}: EmailTriggerSectionProps) => {
    const { translate } = useTranslations();

    const handleAddItem = (newItem: string) => {
        const newWhitelist = [...emailTriggerWhitelist, newItem];
        setTenant((prevState) => ({
            ...prevState,
            emailTriggerWhitelist: newWhitelist,
        }));
    };

    const handleDeleteItem = (itemToDelete: string) => {
        const newWhitelist = emailTriggerWhitelist.filter(
            (item) => item !== itemToDelete
        );
        setTenant((prevState) => ({
            ...prevState,
            emailTriggerWhitelist: newWhitelist,
        }));
    };

    return (
        <Accordion title="Triggering">
            <Box display="flex" alignItems="center" paddingBottom="15px">
                <Typography>Email trigger whitelist</Typography>
                <InfoButtonTooltip message="Email trigger whitelist. Accepts allowed email addresses and domains allowed to trigger processes by email across this tenant." />
            </Box>
            <EmailTriggerWhitelistInput
                emailTriggerWhitelist={emailTriggerWhitelist}
                onAddWhitelistItem={handleAddItem}
            />
            <EmailTriggerWhitelistTable
                emailTriggerWhitelist={emailTriggerWhitelist}
                onDeleteWhitelistItem={handleDeleteItem}
            />
        </Accordion>
    );
};
