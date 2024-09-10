/* eslint-disable max-lines-per-function */
import React, { FunctionComponent, useEffect, useState } from 'react';

import {
    Button,
    Dialog,
    DialogActions,
} from '@mui/material';
import { useSnackbar } from 'notistack';

import If from '#src-app/components/utils/If';

import useTranslations from '#src-app/hooks/useTranslations';

import { useDispatch } from '#src-app/store';

import { globalVariableActions } from '#src-app/store/slices/GlobalVariable';

import { IGlobalVariable } from '#src-app/types/model/global-variable.model';



import {
    VariableDetailsProps,
    VariableState,
    VariableValidation,
    VariableValue,
} from './VariableDetails.types';

import { initialVariableState, mapVariableToInnerState } from './VariableDetails.utils';

import VariableDetailsForm from './VariableDetailsForm';
import { Form, Title, Content } from '../../utils/FormDialog.styles';
import { VariableType } from '../Variable.types';



const VariableDetails: FunctionComponent<VariableDetailsProps> = ({ onClose, variableDetailState }) => {
    const [variable, setVariable] = useState<VariableState>(mapVariableToInnerState(variableDetailState.variable));
    const [validation, setValidation] = useState<VariableValidation>();
    const { translate, translateHTML } = useTranslations();
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();

    const getDialogTitle = () => {
        if (variableDetailState.readOnly) return variableDetailState.variable.name;
        return variableDetailState.variable
            ? translate('Variables.Details.Dialog.Edit.Title')
            : translate('Variables.Details.Dialog.New.Title');
    };

    useEffect(() => {
        if (variableDetailState.show)
        { setVariable(mapVariableToInnerState(variableDetailState.variable)); }
        else
        { setVariable(initialVariableState); }

    }, [variableDetailState.show, variableDetailState.variable]);

    const handleCreateGlobalVariable = (globalVariable: IGlobalVariable) => {
        dispatch(globalVariableActions.createGlobalVariable({ payload: globalVariable }))
            .then(() => {
                enqueueSnackbar(
                    <span>
                        {translateHTML(
                            'Variables.Details.Dialog.New.Message.Created',
                            { name: globalVariable.name },
                        )}
                    </span>,
                    { variant: 'success' },
                );
            })
            .catch(() => {
                enqueueSnackbar(
                    <span>
                        {translateHTML(
                            'Variables.Details.Dialog.New.Message.Error',
                            { name: globalVariable.name },
                        )}
                    </span>,
                    { variant: 'error' },
                );
            })
            .finally(() => {
                onClose();
            });
    };

    const handleEditGlobalVariable = (globalVariable: IGlobalVariable) => {
        dispatch(globalVariableActions.updateGlobalVariable({ payload: globalVariable, resourceId: globalVariable.id }))
            .then(() => {
                enqueueSnackbar(
                    <span>
                        {translateHTML(
                            'Variables.Details.Dialog.Edit.Message.Success',
                            { name: globalVariable.name },
                        )}
                    </span>,
                    { variant: 'success' },
                );
            })
            .catch(() => {
                enqueueSnackbar(
                    <span>
                        {translateHTML(
                            'Variables.Details.Dialog.Edit.Message.Error',
                            { name: globalVariable.name },
                        )}
                    </span>,
                    { variant: 'error' },
                );
            })
            .finally(() => {
                onClose();
            });
    };

    const validateForm = (): boolean => {
        if (variable.name.trim() === '') {
            setValidation({ name: true });
            return true;
        }

        if (variable.type === VariableType.STRING
            && variable.value.trim() === '') {
            setValidation({ value: true });
            return true;
        }

        if (variable.type === VariableType.LIST) {
            const filteredList = variable.value.filter((listItem) => listItem.value.trim() !== '');
            if (filteredList.length === 0) {
                setValidation({ list: true });
                return true;
            }
        }

        return false;
    };

    const isEditMode = variableDetailState.variable !== undefined;

    const prepareListValueForRequest = (list: VariableValue[]) => {
        const values = list
            .map((listItem) => listItem.value)
            .filter((listItem) => listItem.trim() !== '');

        return JSON.stringify(values);
    };

    const mapStateValueToString = () => {
        switch (variable.type) {
            case VariableType.STRING:
            case VariableType.BOOLEAN:
                return variable.value;
            case VariableType.LIST:
                return prepareListValueForRequest(variable.value);
            default:
                return undefined;
        }
    };

    const handleSubmit = () => {
        if (validateForm()) return;

        const newValue: IGlobalVariable = {
            ...variable,
            value: mapStateValueToString(),
        };

        if (isEditMode) {
            const editedValue: IGlobalVariable = {
                ...variableDetailState.variable,
                ...newValue,
            };
            handleEditGlobalVariable(editedValue);
        } else {
            handleCreateGlobalVariable(newValue);
        }
        setValidation({});
    };

    const closeButton = (
        <Button
            variant="contained"
            autoFocus
            color="primary"
            onClick={onClose}
        >
            {translate('Common.Close')}
        </Button>
    );

    return (
        <Dialog
            PaperProps={{
                sx: {
                    minHeight: '80vh',
                    maxHeight: '80vh',
                },
            }}
            open={variableDetailState.show}
            onClose={() => {}}
            fullWidth
            maxWidth="md"
        >
            <Title>{getDialogTitle()}</Title>
            <Content>
                <Form>
                    <VariableDetailsForm
                        variableDetailState={variableDetailState}
                        variable={variable}
                        setVariable={setVariable}
                        validation={validation}
                        setValidation={setValidation}
                    />
                </Form>
            </Content>
            <DialogActions>
                <If condition={!variableDetailState.readOnly} else={closeButton}>
                    <Button
                        color="primary"
                        onClick={onClose}
                    >
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
                </If>
            </DialogActions>
        </Dialog>
    );
};

export default VariableDetails;
