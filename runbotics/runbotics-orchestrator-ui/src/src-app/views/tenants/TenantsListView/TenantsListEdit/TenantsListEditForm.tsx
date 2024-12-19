import { ChangeEvent, FC } from 'react';

import { Box, TextField, Typography } from '@mui/material';

import Accordion from '#src-app/components/Accordion';
import InviteCodeButton from '#src-app/components/InviteCodeButton';
import useTranslations from '#src-app/hooks/useTranslations';
import InfoButtonTooltip from '#src-app/views/process/ProcessBuildView/Modeler/ActionFormPanel/widgets/InfoTooltip/InfoButtonTooltip';

import { TenantsListEditFormProps } from './TenantsListEdit.types';
import { MINIMUM_NAME_CHARACTERS } from './TenantsListEdit.utils';

const TenantsListEditForm: FC<TenantsListEditFormProps> = ({
    tenant,
    setTenant,
    formValidationState,
    setFormValidationState,
    setWasEdited,
    currentTenantName
}) => {
    const { translate } = useTranslations();

    const handleNameFieldInput = (event: ChangeEvent<HTMLInputElement>) => {
        const name = event.target.value;

        setTenant((prevState) => ({ ...prevState, name }));
        setFormValidationState((prevState) => ({
            ...prevState,
            name: (name.trim().length >= MINIMUM_NAME_CHARACTERS)
        }));

        name !== currentTenantName ? setWasEdited(true) : setWasEdited(false);
    };

    return (
        <>
            <TextField
                label={translate('Tenants.List.Edit.Form.Label.Name')}
                value={tenant.name}
                onChange={handleNameFieldInput}
                error={!formValidationState.name}
                {...(tenant.name.trim().length < MINIMUM_NAME_CHARACTERS && { helperText: translate('Tenants.List.Edit.Form.Error.FieldTooShort') })}
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
