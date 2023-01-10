import React, { useEffect, useState, VFC } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import EditIcon from '@mui/icons-material/Edit';

import { Alert, IconButton, Stack, TextField, Typography } from '@mui/material';

import i18n from 'i18next';

import If from '#src-app/components/utils/If';
import useTranslations, { checkIfKeyExists } from '#src-app/hooks/useTranslations';
import { useBpmnFormContext } from '#src-app/providers/BpmnForm.provider';
import { capitalizeFirstLetter } from '#src-app/utils/text';

type Props = {
    onSubmit: (label: string) => void;
};

const ActionLabelForm: VFC<Props> = ({ onSubmit }) => {
    const { translate } = useTranslations();
    const { element, action } = useBpmnFormContext();
    const [formState, setFormState] = useState({ editing: false, label: element.businessObject.label });
    const actionId = element.businessObject?.actionId;
    const [translatedLabel, setTranslatedLabel] = useState(actionId);
    const translationKey = `Process.Details.Modeler.Actions.${actionId ? capitalizeFirstLetter({ text: actionId, lowerCaseRest: false, delimiter: '.', join: '.' }) : ''}.Label`;
    
    useEffect(() => {
        if (checkIfKeyExists(translationKey)) {
            setTranslatedLabel(translate(translationKey));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [i18n.language, actionId]);

    useEffect(() => {
        setFormState({ editing: false, label: element.businessObject.label });
    }, [element, action]);

    const handleChangeEditing = (editing: boolean) => {
        setFormState((prevState) => ({
            ...prevState,
            editing,
        }));
    };

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormState((prevState) => ({
            ...prevState,
            label: event.target.value,
        }));
    };

    const handleSubmit = () => {
        onSubmit(formState.label);
        setFormState({ ...formState, editing: false });
    };

    const EditButtons = () => {
        const isSameAsBefore = formState.label === element.businessObject.label;

        return (
            <>
                <IconButton disabled={isSameAsBefore} type="submit">
                    <DoneIcon />
                </IconButton>
                <IconButton onClick={() => setFormState({ editing: false, label: element.businessObject.label })}>
                    <CloseIcon />
                </IconButton>
            </>
        );
    };

    const ActionNameLabel = () => (
        <Stack direction="row" alignItems="center" gap={1} sx={{ mt: (theme) => theme.spacing(2) }}>
            <Typography variant="h4">{formState.label ? formState.label : translatedLabel}</Typography>
            <IconButton onClick={() => handleChangeEditing(true)}>
                <EditIcon />
            </IconButton>
        </Stack>
    );

    const ActionSystemLabel = () => (
        <>
            {action && action.system && (
                <Alert severity="warning">
                    {translate('Process.Details.Modeler.ActionPanel.Form.ActionSystem.Title', { system: action.system })}
                </Alert>
            )}
        </>
    );

    return (
        <>
            <If condition={formState.editing} else={<ActionNameLabel />}>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label={translate('Process.Details.Modeler.ActionPanel.Form.ActionName.Title')}
                        variant="outlined"
                        value={formState.label}
                        onChange={onChange}
                        fullWidth
                        size="small"
                        sx={{ mt: (theme) => theme.spacing(2) }}
                        InputProps={{ endAdornment: <EditButtons /> }}
                    />
                </form>
            </If>
            <ActionSystemLabel />
        </>
    );
};

export default ActionLabelForm;
