import React, { Dispatch, SetStateAction } from 'react';

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
        <Accordion
            title={translate('Tenants.List.Edit.Form.Section.Triggering')}
        >
            <Box display="flex" alignItems="center" paddingBottom="15px">
                <Typography>
                    {translate('Tenants.List.Edit.Form.Label.Whitelist')}
                </Typography>
                <InfoButtonTooltip
                    message={translate(
                        'Tenants.List.Edit.Form.Label.Whitelist.Tooltip'
                    )}
                />
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
