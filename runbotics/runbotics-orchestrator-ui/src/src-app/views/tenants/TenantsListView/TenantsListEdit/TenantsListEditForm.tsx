import { ChangeEvent, FC } from 'react';

import { Box, TextField, Typography } from '@mui/material';

import Accordion from '#src-app/components/Accordion';
import InviteCodeButton from '#src-app/components/InviteCodeButton';
import useTranslations from '#src-app/hooks/useTranslations';
import InfoButtonTooltip from '#src-app/views/process/ProcessBuildView/Modeler/ActionFormPanel/widgets/InfoTooltip/InfoButtonTooltip';

import { TenantsListEditFormProps } from './TenantsListEdit.types';

const TenantsListEditForm: FC<TenantsListEditFormProps> = ({
    tenant,
    setTenant,
    formValidationState,
    setFormValidationState
}) => {
    const { translate } = useTranslations();

    const handleNameFieldInput = (event: ChangeEvent<HTMLInputElement>) => {
        const name = event.target.value;

        setTenant((prevState) => ({ ...prevState, name }));
        setFormValidationState((prevState) => ({
            ...prevState,
            name: (name.trim() !== '' )
        }));
    };

    return (
        <>
            <TextField
                label={translate('Tenants.List.Edit.Form.Label.Name')}
                value={tenant.name}
                onChange={handleNameFieldInput}
                error={!formValidationState.name}
                {...(!formValidationState.name && { helperText: translate('Tenants.List.Edit.Form.Error.FieldRequired') })}
            />
            <Accordion title={translate('Tenants.List.Edit.Form.Accordion.Title')}>
                <Box display='flex' alignItems='center' paddingBottom='15px'>
                    <Typography>
                        {translate('Tenants.List.Edit.Form.Accordion.Link.Title')}
                    </Typography>
                    <InfoButtonTooltip message={translate('Tenants.List.Edit.Form.Accordion.Link.Info')}/>
                </Box>
                <InviteCodeButton tenantId={tenant.id} fullWidth/>
            </Accordion>
        </>
    );
};

export default TenantsListEditForm;
