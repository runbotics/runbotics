import { ChangeEvent, FC } from 'react';

import { TextField } from '@mui/material';

import useTranslations from '#src-app/hooks/useTranslations';

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
                label='Name'
                value={tenant.name}
                onChange={handleNameFieldInput}
                error={!formValidationState.name}
                {...(!formValidationState.name && { helperText: translate('Users.List.Edit.Form.Error.FieldRequired') })}
            />
        </>
    );
};

export default TenantsListEditForm;
