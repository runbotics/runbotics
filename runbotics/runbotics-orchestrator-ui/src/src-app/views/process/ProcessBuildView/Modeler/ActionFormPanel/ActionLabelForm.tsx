import React, { useEffect, useState, VFC } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import EditIcon from '@mui/icons-material/Edit';
import InfoIcon from '@mui/icons-material/Info';

import {
    Alert,
    IconButton,
    Stack,
    TextField,
    Typography,
    Tooltip,
} from '@mui/material';
import i18n from 'i18next';

import { LabelGroup } from '#src-app/components/Label/Label.styles';
import If from '#src-app/components/utils/If';
import useTranslations, {
    checkIfKeyExists,
} from '#src-app/hooks/useTranslations';
import { useSelector } from '#src-app/store';
import { capitalizeFirstLetter } from '#src-app/utils/text';

type Props = {
    onSubmit: (label: string) => void;
};

// eslint-disable-next-line max-lines-per-function
const ActionLabelForm: VFC<Props> = ({ onSubmit }) => {
    const { translate } = useTranslations();
    const { selectedElement, selectedAction, customValidationErrors } = useSelector(
        (state) => state.process.modeler
    );

    const [formState, setFormState] = useState({
        editing: false,
        label: selectedElement.businessObject.label,
    });
    const actionId = selectedElement.businessObject?.actionId;
    const [translatedLabel, setTranslatedLabel] = useState(actionId);
    const actionPartialTranslationKey = actionId
        ? capitalizeFirstLetter({
            text: actionId,
            lowerCaseRest: false,
            delimiter: '.',
            join: '.',
        })
        : '';
    const translationKey = `Process.Details.Modeler.Actions.${actionPartialTranslationKey}.Label`;

    useEffect(() => {
        if (checkIfKeyExists(translationKey)) {
            const mainActionGroup = actionPartialTranslationKey.split('.')[0];
            const actionGroupPrefixTranslationKey = `Process.Details.Modeler.ActionsGroup.${mainActionGroup}`;

            // @ts-ignore
            const fullLabel = checkIfKeyExists(actionGroupPrefixTranslationKey)
                ? `${translate(actionGroupPrefixTranslationKey)}: ${translate(translationKey)}`
                : translate(translationKey);

            setTranslatedLabel(fullLabel);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [i18n.language, actionId]);

    useEffect(() => {
        setFormState({
            editing: false,
            label: selectedElement.businessObject.label,
        });
    }, [selectedElement, selectedAction]);

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
        const isSameAsBefore =
            formState.label === selectedElement.businessObject.label;

        return (
            <>
                <IconButton disabled={isSameAsBefore} type="submit">
                    <DoneIcon />
                </IconButton>
                <IconButton
                    onClick={() =>
                        setFormState({
                            editing: false,
                            label: selectedElement.businessObject.label,
                        })
                    }
                >
                    <CloseIcon />
                </IconButton>
            </>
        );
    };

    const ActionNameLabel = () => (
        <Stack
            direction="row"
            alignItems="center"
            gap={1}
            sx={{ mt: (theme) => theme.spacing(2) }}
        >
            <Typography variant="h4">
                {formState.label ? formState.label : translatedLabel}
            </Typography>
            <IconButton onClick={() => handleChangeEditing(true)}>
                <EditIcon />
            </IconButton>
        </Stack>
    );

    const ActionSystemLabel = () => (
        <>
            {selectedAction && selectedAction.system && (
                <Alert
                    severity="warning"
                    sx={{
                        mt: (theme) => theme.spacing(1),
                        alignItems: 'center',
                        width: 'fit-content'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                        {translate(
                            'Process.Details.Modeler.ActionPanel.Form.ActionSystem.Title',
                            { system: selectedAction.system }
                        )}
                    </div>
                </Alert>
            )}
        </>
    );

    const ActionHelperTextLabel = () => (
        <>
            {selectedAction && selectedAction.helperTextLabel && (
                <Alert
                    severity="warning"
                    sx={{
                        mt: (theme) => theme.spacing(1),
                        alignItems: 'center',
                        width: 'fit-content'
                    }}
                >
                    <LabelGroup>{selectedAction.helperTextLabel}</LabelGroup>
                </Alert>
            )}
        </>
    );

    const CustomValidationError = () => (
        <>
            {customValidationErrors.length > 0 && (
                <Alert
                    severity="error"
                    sx={{
                        mt: (theme) => theme.spacing(1),
                        alignItems: 'center'
                    }}
                >
                    <LabelGroup>{translate('Process.BuildView.Modeler.Widgets.VariableNameIsTaken')}</LabelGroup>
                </Alert>
            )}
        </>
    );

    return (
        <>
            <If condition={formState.editing} else={<ActionNameLabel />}>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label={translate(
                            'Process.Details.Modeler.ActionPanel.Form.ActionName.Title'
                        )}
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
            <CustomValidationError />
            <ActionSystemLabel />
            <ActionHelperTextLabel />
        </>
    );
};

export default ActionLabelForm;
