import { FC, useEffect } from 'react';

import { Grid, MenuItem, SelectChangeEvent, Typography } from '@mui/material';

import useTranslations from '#src-app/hooks/useTranslations';

import { useDispatch, useSelector } from '#src-app/store';
import { credentialTemplatesActions, credentialTemplatesSelector } from '#src-app/store/slices/CredentialTemplates';

import GeneralInfoDropdown from './CreateGeneralInfoDropdown';

interface TemplateDropdownProps {
    selectedValue: string;
    handleChange: (event: SelectChangeEvent) => void;
    error: boolean;
    helperText: string;
}

export const TemplateDropdown: FC<TemplateDropdownProps> = ({ selectedValue, handleChange, error, helperText }) => {
    const { translate } = useTranslations();
    const dispatch = useDispatch();
    const { credentialTemplates } = useSelector(credentialTemplatesSelector);

    useEffect(() => {
        dispatch(credentialTemplatesActions.fetchAllTemplates());
    }, []);

    const templatesToChoose = credentialTemplates
        ? credentialTemplates.map(template => (
            <MenuItem key={template.id} value={template.id}>
                <Typography>{template.name}</Typography>
            </MenuItem>
        ))
        : null;

    return (
        <Grid item xs={12}>
            <GeneralInfoDropdown
                disabled={false}
                selectLabel={translate('Credential.Details.Template.Label')}
                tooltipText={translate('Credential.Details.Template.Info')}
                selectOptions={templatesToChoose}
                selectedValue={selectedValue}
                handleChange={handleChange}
                required
                error={error}
                helperText={helperText}
            />
        </Grid>
    );
};
