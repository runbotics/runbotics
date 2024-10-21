import { ChangeEvent, FC } from 'react';

import { TextField } from '@mui/material';

import useTranslations from '#src-app/hooks/useTranslations';

import { IAction } from '#src-app/types/model/action.model';

import { isStringValueEmpty } from '#src-app/utils/isStringValueEmpty';

import { ExternalActionFormValidationState, isScriptNameValid } from '../action.utils';


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

        setFormValidationState(prevState => ({
            ...prevState,
            script: isScriptNameValid(e.target.value)
        }));
    };

    const handleLabelChange = (e: ChangeEvent<HTMLInputElement>) => {
        setDraft(prev => ({
            ...prev,
            label: e.target.value
        }));

        setFormValidationState(prevState => ({
            ...prevState,
            label: !isStringValueEmpty(e.target.value)
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
                    margin: theme => `${theme.spacing(1)} 0 ${theme.spacing(5)} 0`
                }}
                value={draft.label}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleLabelChange(e)}
                autoComplete="off"
                {...labelInputErrorProperties}
            />
        </>
    );
};
