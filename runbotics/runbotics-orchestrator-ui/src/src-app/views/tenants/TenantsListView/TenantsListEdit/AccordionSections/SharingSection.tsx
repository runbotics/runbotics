import React from 'react';

import { Box, Typography } from '@mui/material';

import Accordion from '#src-app/components/Accordion';
import InviteCodeButton from '#src-app/components/InviteCodeButton';
import useTranslations from '#src-app/hooks/useTranslations';
import InfoButtonTooltip from '#src-app/views/process/ProcessBuildView/Modeler/ActionFormPanel/widgets/InfoTooltip/InfoButtonTooltip';

interface SharingSectionProps {
    tenantId: string;
}

export const SharingSection = ({ tenantId }: SharingSectionProps) => {
    const { translate } = useTranslations();

    return (
        <Accordion title={translate('Tenants.List.Edit.Form.Accordion.Title')}>
            <Box display="flex" alignItems="center" paddingBottom="15px">
                <Typography>
                    {translate('Tenants.List.Edit.Form.Accordion.Link.Title')}
                </Typography>
                <InfoButtonTooltip
                    message={translate(
                        'Tenants.List.Edit.Form.Accordion.Link.Info'
                    )}
                />
            </Box>
            <InviteCodeButton tenantId={tenantId} fullWidth />
        </Accordion>
    );
};
