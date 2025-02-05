import { ChangeEvent, FC, useEffect } from 'react';

import { TextField } from '@mui/material';

import useTranslations from '#src-app/hooks/useTranslations';

import { EmailTriggerSection } from './AccordionSections/EmailTriggerSection/EmailTriggerSection';
import { SharingSection } from './AccordionSections/SharingSection';
import { TenantsListEditFormProps } from './TenantsListEdit.types';
import { MINIMUM_NAME_CHARACTERS } from './TenantsListEdit.utils';

const TenantsListEditForm: FC<TenantsListEditFormProps> = ({
    tenant,
    setTenant,
    formValidationState,
    setFormValidationState,
    currentTenantName,
    currentWhitelist,
}) => {
    const { translate } = useTranslations();

    const handleNameFieldInput = (event: ChangeEvent<HTMLInputElement>) => {
        const name = event.target.value;

        setTenant((prevState) => ({ ...prevState, name }));
    };

    const wasFormChanged = () => {
        const wasTenantNameChanged = tenant.name !== currentTenantName;
        const wasWhitelistChanged =
            currentWhitelist.length !== tenant.emailTriggerWhitelist?.length ||
            !currentWhitelist.every(item => tenant.emailTriggerWhitelist.includes(item));

        return {
            wasTenantNameChanged,
            wasWhitelistChanged,
        };
    };

    useEffect(() => {
        const { wasTenantNameChanged, wasWhitelistChanged } = wasFormChanged();
        setFormValidationState((prevState) => ({
            ...prevState,
            name: tenant.name.trim().length >= MINIMUM_NAME_CHARACTERS,
            wasChanged: wasTenantNameChanged || wasWhitelistChanged,
            wasTenantNameChanged,
            wasWhitelistChanged,
        }));
    }, [tenant]);

    return (
        <>
            <TextField
                label={translate('Tenants.List.Edit.Form.Label.Name')}
                value={tenant.name}
                onChange={handleNameFieldInput}
                error={!formValidationState.name}
                {...(tenant.name.trim().length < MINIMUM_NAME_CHARACTERS && {
                    helperText: translate(
                        'Tenants.List.Edit.Form.Error.FieldTooShort'
                    ),
                })}
            />
            <SharingSection tenantId={tenant.id} />
            <EmailTriggerSection
                tenant={tenant}
                setTenant={setTenant}
            />
        </>
    );
};

export default TenantsListEditForm;
