import React, { useEffect, useState, VFC } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import EditIcon from '@mui/icons-material/Edit';

import { IconButton, Stack, TextField, Typography } from '@mui/material';

import If from '#src-app/components/utils/If';
import useTranslations from '#src-app/hooks/useTranslations';

import { IBpmnConnection } from '#src-app/views/process/ProcessBuildView/Modeler/helpers/elementParameters';

type Props = {
    onSubmit: (label: string) => void;
    selectedElement: IBpmnConnection;
    onCancel: () => void;
    onFocus: (event: React.FocusEvent<HTMLInputElement>) => void;
};

const FlowLabelForm: VFC<Props> = ({ onSubmit, selectedElement, onCancel, onFocus }) => {
    const { translate } = useTranslations();

    const [formState, setFormState] = useState({
        editing: false,
        label: selectedElement.businessObject.name as string,
    });

    useEffect(() => {
        setFormState({
            editing: false,
            label: selectedElement.businessObject.name as string,
        });
    }, [selectedElement]);

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
    
    const handleCloseForm = () => {
        setFormState({
            editing: false,
            label: selectedElement.businessObject.name as string,
        });
        onCancel();
    };

    const EditButtons = () => {
        const isEqual = formState.label === selectedElement.businessObject.label;
        return (
            <>
                <IconButton disabled={isEqual} type="submit">
                    <DoneIcon />
                </IconButton>
                <IconButton onClick={handleCloseForm}>
                    <CloseIcon />
                </IconButton>
            </>
        );
    };

    const FlowNameLabel = () => (
        <Stack
            direction="row"
            alignItems="center"
            gap={1}
            sx={{ mt: (theme) => theme.spacing(2) }}
        >
            <Typography variant="h4">
                {formState.label ? formState.label : selectedElement.id}
            </Typography>
            <IconButton onClick={() => handleChangeEditing(true)}>
                <EditIcon />
            </IconButton>
        </Stack>
    );

    return (
        <>
            <If condition={formState.editing} else={<FlowNameLabel />}>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label={translate(
                            'Process.Details.Modeler.ActionPanel.Form.FlowName.Title'
                        )}
                        variant="outlined"
                        value={formState.label}
                        name={selectedElement.id}
                        onChange={onChange}
                        fullWidth
                        size="small"
                        sx={{ mt: (theme) => theme.spacing(2) }}
                        InputProps={{ endAdornment: <EditButtons /> }}
                        onFocus={onFocus}
                    />
                </form>
            </If>
        </>
    );
};

export default FlowLabelForm;
