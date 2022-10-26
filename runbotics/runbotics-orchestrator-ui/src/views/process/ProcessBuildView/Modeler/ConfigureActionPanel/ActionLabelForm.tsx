import React, { useEffect, useState, VFC } from 'react';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Alert from '@mui/material/Alert';
import If from 'src/components/utils/If';
import { useBpmnFormContext } from 'src/providers/BpmnForm.provider';
import useTranslations from 'src/hooks/useTranslations';

type Props = {
    onSubmit: (label: string) => void;
};

const ActionLabelForm: VFC<Props> = ({ onSubmit }) => {
    const { element, action } = useBpmnFormContext();
    const [formState, setFormState] = useState({ editing: false, label: element.businessObject.label });
    const { translate } = useTranslations();
    // using 'runbotics' xml field is a temporary solution
    const translateKey = element.businessObject?.runbotics;
    // @ts-ignore
    const translatedLabel = translate(translateKey);

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
            <Typography variant="h4">{formState.label !== "" ? formState.label : translatedLabel}</Typography>
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
