import React, { useEffect, useState, VFC } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import EditIcon from '@mui/icons-material/Edit';

import { IconButton, Stack, TextField, Typography } from '@mui/material';

import If from '#src-app/components/utils/If';

import {
    FlowLabelFormStyled
} from '#src-app/views/process/ProcessBuildView/Modeler/ActionFormPanel/FlowLabelForm.styles';
import { BPMNElement } from '#src-app/views/process/ProcessBuildView/Modeler/helpers/elementParameters';

type Props = {
    formLabel: string;
    onSubmit: (label: string) => void;
    selectedElement: BPMNElement;
    onCancel?: () => void;
    onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
};

const FlowLabelForm: VFC<Props> = ({ formLabel, onSubmit, selectedElement, onCancel, onFocus }) => {
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
        if (onCancel) {
            onCancel();
        }
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
        <FlowLabelFormStyled>
            <If condition={formState.editing} else={<FlowNameLabel />}>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label={formLabel}
                        variant="outlined"
                        value={formState.label}
                        name={selectedElement.id}
                        onChange={onChange}
                        fullWidth
                        size="small"
                        sx={{ mt: (theme) => theme.spacing(2) }}
                        InputProps={{ endAdornment: <EditButtons /> }}
                        onFocus={onFocus}
                        autoFocus={formState.editing}
                    />
                </form>
            </If>
        </FlowLabelFormStyled>
    );
};

export default FlowLabelForm;
