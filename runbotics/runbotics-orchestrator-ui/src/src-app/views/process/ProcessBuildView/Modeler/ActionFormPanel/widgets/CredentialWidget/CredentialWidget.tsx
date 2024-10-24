import { FC, useEffect, useMemo, useState } from 'react';

import { Edit } from '@mui/icons-material';
import { Box, Button, Divider, Typography } from '@mui/material';
import { WidgetProps } from '@rjsf/core';
import { CredentialDto } from 'runbotics-common';

import { translate } from '#src-app/hooks/useTranslations';
import { useDispatch, useSelector } from '#src-app/store';
import { credentialsActions } from '#src-app/store/slices/Credentials';
import getCredentialType from '#src-app/utils/getCredentialData';

import { getCredentialBreadcrumb } from './CredentialWidget.utils';
import { CustomCredentialSelectDialog } from './CustomCredentialSelectDialog';

const CredentialWidget: FC<WidgetProps> = (props) => {
    const [open, setOpen] = useState(false);
    const processId = useSelector(state => state.process.draft.process.id);
    const { selectedElement } = useSelector(state => state.process.modeler);
    const {
        allByTemplateAndProcess,
        allProcessAssigned
    } = useSelector(state => state.credentials);
    const dispatch = useDispatch();
    const credentialType = getCredentialType(selectedElement);

    useEffect(() => {
        dispatch(credentialsActions.fetchAllCredentialsByTemplateAndProcess({ pageParams: { templateName: credentialType, processId: processId } }));
        dispatch(credentialsActions.fetchAllCredentialsAssignedToProcess({ resourceId: processId }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [credentialType, processId]);

    const alreadySelectedCredential = allByTemplateAndProcess.find(cred => cred.id === props.value);
    const [credential, setCredential] = useState<CredentialDto | string>(alreadySelectedCredential);
    const isCustomCredential = Boolean(credential);
    const primaryCredential = allProcessAssigned.find(cred => cred?.order === 1);
    const breadcrumb = useMemo(() => getCredentialBreadcrumb(credential ?? alreadySelectedCredential, primaryCredential), [credential, primaryCredential, alreadySelectedCredential]);

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const confirmSetCredential = (newCredential: CredentialDto | string): void => {
        setCredential(newCredential);
        if (typeof newCredential === 'object' && 'id' in newCredential) {
            props.onChange(newCredential.id);
        } else if (typeof newCredential === 'string') {
            props.onChange(newCredential);
        } else {
            throw new Error('Invalid credential type');
        }
    };

    return (
        <>
            <Typography variant="h5">{translate('Credentials.ActionFormSelect.Form.Section.Title')}</Typography>
            <Divider />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
                <Typography variant="h6">{breadcrumb}</Typography>
                <Typography variant="h6">
                    {
                        isCustomCredential
                            ? translate('Credentials.ActionFormSelect.Form.CustomCredential.True')
                            : translate('Credentials.ActionFormSelect.Form.CustomCredential.False')
                    }
                </Typography>
                <Button onClick={handleOpen} variant='text'><Edit /></Button>
            </Box>
            <CustomCredentialSelectDialog
                isOpen={open}
                handleClose={handleClose}
                templateName={credentialType}
                setCredential={confirmSetCredential}
                credential={credential}
            />
        </>
    );
};

export default CredentialWidget;
