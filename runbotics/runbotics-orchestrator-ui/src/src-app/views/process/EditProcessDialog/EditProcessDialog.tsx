import React, { FC, useState, useEffect } from 'react';

import { Box } from '@mui/material';
import { useSnackbar } from 'notistack';
import { FeatureKey, ProcessDto } from 'runbotics-common';

import CustomDialog from '#src-app/components/CustomDialog';
import { hasFeatureKeyAccess } from '#src-app/components/utils/Secured';
import useTranslations, { checkIfKeyExists } from '#src-app/hooks/useTranslations';
import { useDispatch, useSelector } from '#src-app/store';

import { processActions } from '#src-app/store/slices/Process';

import LoadingType from '#src-app/types/loading';
import { capitalizeFirstLetter } from '#src-app/utils/text';

import AccessOptions from './AccessOptions';
import { EditProcessDialogProps, FormValidationState } from './EditProcessDialog.types';
import { initialFormValidationState, inputErrorMessages, InputErrorType } from './EditProcessDialog.utils';
import { GeneralOptions } from './GeneralOptions/GeneralOptions';
import { Content, Form } from '../../utils/FormDialog.styles';


const EditProcessDialog: FC<EditProcessDialogProps> = ({
    process, onAdd, onClose, open,
}) => {
    const [formValidationState, setFormValidationState] = useState<FormValidationState>(initialFormValidationState);
    const [inputErrorType, setInputErrorType] = useState<InputErrorType>(null);
    const [processFormState, setProcessFormState] = useState<ProcessDto>({ ...process });
    const [isNameDirty, setIsNameDirty] = useState<boolean>(false);
    const { loading: isStoreLoading } = useSelector((state) => state.process.all);
    const { loading: processLoadingState } = useSelector((state) => state.process.draft);
    const [isLoading, setIsLoading] = useState(isStoreLoading || processLoadingState === LoadingType.PENDING);

    const { enqueueSnackbar } = useSnackbar();
    const { translate } = useTranslations();
    const { user: currentUser } = useSelector((state) => state.auth);

    const isOwner = !process || currentUser.email === process?.createdBy.email || hasFeatureKeyAccess(currentUser, [FeatureKey.PROCESS_COLLECTION_ALL_ACCESS]);

    const checkIsFormValid = () => Object.values(formValidationState).every(Boolean);
    const dispatch = useDispatch();

    useEffect(() => {
        setProcessFormState(process);
        setFormValidationState(initialFormValidationState);
    }, []);

    useEffect(() => {
        if (processFormState.name) {
            setIsNameDirty(true);
        }
        if (isNameDirty && (!processFormState.name || !processFormState.name.trim())) {
            setInputErrorType(InputErrorType.REQUIRED);
            setFormValidationState((prevState) => ({ ...prevState, name: false }));
            return;
        }
        setFormValidationState((prevState) => ({ ...prevState, name: true }));
        setInputErrorType(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [processFormState.name]);

    const handleSubmit = () => {
        setIsLoading(true);
        try {
            if (!checkIsFormValid()) {
                enqueueSnackbar(inputErrorMessages[inputErrorType], { variant: 'error' });
                return;
            }
            if (!process.id) {
                const processInfo: ProcessDto = { ...processFormState };
                dispatch(
                    processActions.createProcess({ payload: processInfo })
                )
                    .unwrap()
                    .then((res) => {
                        onAdd(res);
                        dispatch(processActions.fetchProcessById(res.id));
                    });
                return;
            }
            if (processFormState.processCollection?.id === null) {
                const { processCollection: _processCollection, ...rest } = processFormState;
                onAdd(rest);
            }
            onAdd(processFormState);
            setIsLoading(false);
            onClose();
        } catch (error) {
            const message = error?.message ?? translate('Process.Add.Form.Error.General');
            const translationKey = `Process.Add.Form.Error.${capitalizeFirstLetter({ text: error.message, delimiter: ' ' })}`;
            checkIfKeyExists(translationKey)
                ? enqueueSnackbar(
                    translate(translationKey), {
                        variant: 'error'
                    }
                )
                : enqueueSnackbar(
                    message, {
                        variant: 'error'
                    }
                );
        }
    };

    return (
        <CustomDialog
            isOpen={open}
            onClose={onClose}
            title={process.id ? translate('Process.Edit.Title') : translate('Process.Add.Title')}
            confirmButtonOptions={{
                label: translate('Common.Save'),
                onClick: handleSubmit,
                isDisabled: !checkIsFormValid() || isLoading,
            }}
            cancelButtonOptions={{
                label: translate('Common.Cancel'),
                onClick: onClose,
                isDisabled: isLoading,
            }}
        >
            <Box sx={isLoading && { pointerEvents: 'none', opacity: 0.7 }}>
                <Content sx={{ overflowX: 'hidden' }}>
                    <Form $gap={0}>
                        <GeneralOptions
                            processData={processFormState}
                            setProcessData={setProcessFormState}
                            formValidationState={formValidationState}
                            setFormValidationState={setFormValidationState}
                            inputErrorType={inputErrorType}
                            isEditDialogOpen={open}
                            formState={processFormState}
                            setFormState={setProcessFormState}
                            isOwner={isOwner}
                        />
                        <AccessOptions
                            processData={processFormState}
                            setProcessData={setProcessFormState}
                            isEditDialogOpen={open}
                            isOwner={isOwner}
                        />
                    </Form>
                </Content>
            </Box>
        </CustomDialog>
    );
};

export default EditProcessDialog;
