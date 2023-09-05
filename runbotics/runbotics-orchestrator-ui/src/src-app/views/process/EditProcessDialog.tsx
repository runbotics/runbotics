import React, { FC, useState } from 'react';

import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    FormControl,
    TextField,
    Switch,
    FormControlLabel,
    Box,
} from '@mui/material';
import { IProcess } from 'runbotics-common';


import useTranslations from '#src-app/hooks/useTranslations';

import BotCollectionComponent from './ProcessConfigureView/BotCollection.component';
import BotSystemComponent from './ProcessConfigureView/BotSystem.component';
import { Form } from '../utils/FormDialog.styles';


type EditProcessDialogProps = {
    open?: boolean;
    process: IProcess;
    onClose: () => void;
    onAdd: (process: IProcess) => void;
};

const EditProcessDialog: FC<EditProcessDialogProps> = ({
    process, onAdd, onClose, open,
}) => {
    const [formState, setFormState] = useState<IProcess>({ ...process });
    const { translate } = useTranslations();

    const handleSubmit = () => {
        onAdd(formState);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormState({ ...formState, [e.target.name]: e.target.value });
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>{translate('Process.Edit.Title')}</DialogTitle>
            <DialogContent>
                <Form>
                    <FormControl fullWidth>
                        <TextField
                            fullWidth
                            margin="normal"
                            name="name"
                            label={translate('Process.Edit.Form.Fields.Name.Label')}
                            onChange={handleInputChange}
                            value={formState.name}
                            variant="outlined"
                            required
                        />
                        <TextField
                            fullWidth
                            label={translate('Process.Edit.Form.Fields.Description.Label')}
                            margin="normal"
                            name="description"
                            onChange={handleInputChange}
                            value={formState.description}
                            variant="outlined"
                        />
                        <Box display="flex" justifyContent="space-between">
                            <BotCollectionComponent
                                selectedBotCollection={formState.botCollection}
                                onSelectBotCollection={(botCollection) => setFormState({ ...formState, botCollection })}
                            />
                            <BotSystemComponent
                                selectedBotSystem={formState.system}
                                onSelectBotSystem={(system) => setFormState({ ...formState, system })}
                            />
                        </Box>
                        <FormControlLabel
                            control={(
                                <Switch
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        setFormState({ ...formState, isPublic: e.target.checked });
                                    }}
                                    checked={formState.isPublic}
                                />
                            )}
                            label={translate('Process.Edit.Form.Fields.Public.Label')}
                            labelPlacement="start"
                            sx={{
                                width: 'fit-content', marginLeft: '0', padding: '0.5rem',
                            }}
                        />
                    </FormControl>
                </Form>
            </DialogContent>
            <DialogActions>
                <Button color="primary" onClick={onClose}>
                    {translate('Common.Cancel')}
                </Button>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    autoFocus
                    onClick={handleSubmit}
                >
                    {translate('Common.Save')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditProcessDialog;
