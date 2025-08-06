import { ChangeEvent, FC, useEffect } from 'react';

import { Stack, TextField } from '@mui/material';

import { ActionCredentialType } from 'runbotics-common';

import useTranslations from '#src-app/hooks/useTranslations';

import { useSelector } from '#src-app/store';
import { credentialTemplatesSelector } from '#src-app/store/slices/CredentialTemplates';
import { IAction } from '#src-app/types/model/action.model';

import { isStringValueEmpty } from '#src-app/utils/isStringValueEmpty';

import { TemplateDropdown } from '#src-app/views/credentials/Credential/CreateGeneralInfo/TemplateDropdown';

import { ExternalActionFormValidationState, isCredentialTypeValid, isScriptNameValid } from '../action.utils';


interface ExternalActionFormProps {
    draft: IAction;
    setDraft: (value: React.SetStateAction<IAction>) => void;
    formValidationState: ExternalActionFormValidationState;
    setFormValidationState: (value: React.SetStateAction<ExternalActionFormValidationState>) => void;
}

export const ExternalActionForm: FC<ExternalActionFormProps> = ({ draft, setDraft, formValidationState, setFormValidationState }) => {
    const { credentialTemplates } = useSelector(credentialTemplatesSelector);
    const { translate } = useTranslations();

    const handleScriptChange = (e: ChangeEvent<HTMLInputElement>) => {
        setDraft(prev => ({
            ...prev,
            script: e.target.value
        }));
    };

    const handleLabelChange = (e: ChangeEvent<HTMLInputElement>) => {
        setDraft(prev => ({
            ...prev,
            label: e.target.value
        }));
    };

    const handleCredentialTypeChange = (e: ChangeEvent<HTMLInputElement>) => {
        const name = credentialTemplates.find(template => template.id === e.target.value)?.name;
        setDraft(prev => ({
            ...prev,
            credentialType: name
        }));
    };

    const scriptInputErrorProperties = {
        ...!formValidationState.script && {
            error: true,
            helperText: translate('Action.Details.Form.Script.Error'),
        },
    };

    const labelInputErrorProperties = {
        ...(!formValidationState.label && {
            error: true,
            helperText: translate('Action.Details.Form.Label.Error'),
        }),
    };

    const credentialTypeInputErrorProperties = {
        ...(!formValidationState.credentialType && {
            error: true,
            helperText: translate(
                'Action.Details.Form.CredentialType.Error',
                {
                    types: Object.values(ActionCredentialType).join(', '),
                },
            ),
        }),
    };

    useEffect(() => {
        const { script, label, credentialType } = draft;
        setFormValidationState(prevState => ({
            ...prevState,
            script: isScriptNameValid(script),
            label: !isStringValueEmpty(label),
            credentialType: isStringValueEmpty(credentialType) || isCredentialTypeValid(credentialType),
        }));
    }, [draft.label, draft.script, draft.credentialType]);

    return (
        <Stack spacing={2} sx={{margin: theme => `${theme.spacing(1)} 0`}}>
            <TextField
                fullWidth
                label={translate('Action.Details.Script')}
                name="script"
                value={draft.script}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleScriptChange(e)}
                autoComplete="off"
                {...scriptInputErrorProperties}
            />
            <TextField
                fullWidth
                label={translate('Action.Details.Label')}
                name="label"
                required
                value={draft.label}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleLabelChange(e)}
                autoComplete="off"
                {...labelInputErrorProperties}
            />
            <TemplateDropdown
                selectedValue={credentialTemplates.find(template => template.name === draft.credentialType)?.id || ''}
                handleChange={handleCredentialTypeChange}
                error={credentialTypeInputErrorProperties.error}
                helperText={credentialTypeInputErrorProperties.helperText}
            />
        </Stack>
    );
};
