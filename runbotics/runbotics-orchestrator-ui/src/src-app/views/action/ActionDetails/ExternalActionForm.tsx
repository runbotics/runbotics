import { ChangeEvent, FC } from 'react';

import { TextField } from '@mui/material';

import useTranslations from '#src-app/hooks/useTranslations';

import { IAction } from '#src-app/types/model/action.model';

import { ExternalActionFormValidationState, isScriptNameValid, isValueEmpty } from '../action.utils';


interface ExternalActionFormProps {
    draft: IAction;
    setDraft: (value: React.SetStateAction<IAction>) => void;
    formValidationState: ExternalActionFormValidationState;
    setFormValidationState: (value: React.SetStateAction<ExternalActionFormValidationState>) => void;
}

export const ExternalActionForm: FC<ExternalActionFormProps> = ({ draft, setDraft, formValidationState, setFormValidationState }) => {
    const { translate } = useTranslations();

    const handleChange = (field: string, e: ChangeEvent<HTMLInputElement>) => {
        setDraft(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));

        if (field === 'script') {
            setFormValidationState(prevState => ({
                ...prevState,
                script: isScriptNameValid(e.target.value)
            }));
        }

        if (field === 'label') {
            setFormValidationState(prevState => ({
                ...prevState,
                label: isValueEmpty(e.target.value)
            }));
        }
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
                    margin: (theme) =>
                        `${theme.spacing(1)} 0`,
                }}
                value={draft.script}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('script', e)}
                autoComplete="off"
                {...scriptInputErrorProperties}
            />
            <TextField
                fullWidth
                label={translate('Action.Details.Label')}
                name="label"
                required
                sx={{
                    margin: (theme) =>
                        `${theme.spacing(
                            1
                        )} 0 ${theme.spacing(5)} 0`,
                }}
                value={draft.label}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('label', e)}
                autoComplete="off"
                {...labelInputErrorProperties}
            />
        </>
    );
};
