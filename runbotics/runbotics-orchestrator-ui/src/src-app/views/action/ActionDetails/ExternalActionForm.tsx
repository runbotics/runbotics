import { ChangeEvent, FC, useEffect } from 'react';

import { TextField } from '@mui/material';

import { ActionCredentialType } from 'runbotics-common';

import useTranslations from '#src-app/hooks/useTranslations';

import { IAction } from '#src-app/types/model/action.model';

import { isStringValueEmpty } from '#src-app/utils/isStringValueEmpty';

import { ExternalActionFormValidationState, isCredentialTypeValid, isScriptNameValid } from '../action.utils';


interface ExternalActionFormProps {
    draft: IAction;
    setDraft: (value: React.SetStateAction<IAction>) => void;
    formValidationState: ExternalActionFormValidationState;
    setFormValidationState: (value: React.SetStateAction<ExternalActionFormValidationState>) => void;
}

export const ExternalActionForm: FC<ExternalActionFormProps> = ({ draft, setDraft, formValidationState, setFormValidationState }) => {
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
        setDraft(prev => ({
            ...prev,
            credentialType: e.target.value
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
        <>
            <TextField
                fullWidth
                label={translate('Action.Details.Script')}
                name="script"
                sx={{
                    margin: theme => `${theme.spacing(1)} 0`
                }}
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
                sx={{
                    margin: theme => `${theme.spacing(1)} 0`
                }}
                value={draft.label}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleLabelChange(e)}
                autoComplete="off"
                {...labelInputErrorProperties}
            />
            <TextField
                fullWidth
                label={'Credential Type'}
                name="credentialType"
                sx={{
                    margin: theme => `${theme.spacing(1)} 0 ${theme.spacing(5)} 0`
                }}
                value={draft.credentialType ?? ''}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleCredentialTypeChange(e)}
                autoComplete="off"
                {...credentialTypeInputErrorProperties}
            />
        </>
    );
};
