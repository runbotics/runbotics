import { useEffect, useMemo, useState } from 'react';

import { Typography } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';

import LockIcon from '#public/images/icons/lock.svg';
import { useRequiredCredentialTypes } from '#src-app/credentials/useRequiredCredentialTypes';
import useWindowSize from '#src-app/hooks/useWindowSize';
import { useDispatch, useSelector } from '#src-app/store';
import { processActions, processSelector } from '#src-app/store/slices/Process';

import ActionCredential from './ActionCredential';
import ActionCredentialAdd from './ActionCredentialAdd';
import {
    ActionBox, ActionBoxContent,
    ActionBoxHeader, ActionsColumns,
    ActionsContainer, Container, Header
} from './ProcessCredentials.styles';
import { ActionSortedColumns, sortByActionCredentialType, sortByColumns } from './ProcessCredentials.utils';
import { ProcessCredentialsAddDialog } from './ProcessCredentialsAddDialog';
import { ProcessCredentialsDeleteDialog } from './ProcessCredentialsDeleteDialog';

const ACTION_MIN_WIDTH = 400;
const MARGIN_LIMIT = 800;

const ProcessCredentials = () => {
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();
    const { id: processId } = useRouter().query;
    const { draft: { credentials: processCredentials } } = useSelector(processSelector);
    const credentialTypes = useRequiredCredentialTypes();
    const actionCredentials = useMemo(
        () => credentialTypes ? sortByActionCredentialType(processCredentials, credentialTypes) : null,
        [processCredentials, credentialTypes]
    );

    const [columns, setColumns] = useState<ActionSortedColumns>([]);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [currentCredentialId, setCurrentCredentialId] = useState(null);

    const { width: windowWidth } = useWindowSize();
    const rowCount = Math.ceil((Math.abs(windowWidth - MARGIN_LIMIT)) / ACTION_MIN_WIDTH);

    const handleDelete = () => {
        dispatch(processActions.deleteProcessCredential({ resourceId: currentCredentialId }))
            .unwrap()
            .then(() => {
                enqueueSnackbar('Did it', {
                    variant: 'success'
                });
                dispatch(processActions.getProcessCredentials({ resourceId: String(processId) }));
            })
            .catch(() => {
                enqueueSnackbar('not ;c Did it', {
                    variant: 'error'
                });
            });

        setIsDeleteDialogOpen(false);
    };

    const handleEditDialogOpen = () => {
        setIsEditDialogOpen(true);
    };

    const handleEditDialogClose = () => {
        setIsEditDialogOpen(false);
    };

    const handleDeleteDialogOpen = (credentialId: string) => {
        setIsDeleteDialogOpen(true);
        setCurrentCredentialId(credentialId);
    };

    const handleDeleteDialogClose = () => {
        setIsDeleteDialogOpen(false);
    };

    useEffect(() => {
        if (actionCredentials) {
            const actionSortedColumns = sortByColumns(actionCredentials, rowCount);
            setColumns(actionSortedColumns);
        }
    }, [windowWidth, actionCredentials]);

    useEffect(() => {
        dispatch(processActions.getProcessCredentials({ resourceId: String(processId) }));
    }, []);

    return (
        <Container>
            <ProcessCredentialsDeleteDialog
                isOpen={isDeleteDialogOpen}
                handleClose={handleDeleteDialogClose}
                handleDelete={handleDelete}
            />
            <ProcessCredentialsAddDialog
                isOpen={isEditDialogOpen}
                handleClose={handleEditDialogClose}
            />
            <Header>
                <Image src={LockIcon} alt='lock icon' style={{ filter: 'brightness(0) saturate(100%)' }}/>
                <Typography>Credentials</Typography>
            </Header>
            <ActionsContainer $rowCount={rowCount}>
                {columns.map((column, idx) => (
                    <ActionsColumns key={column.count + String(idx)}>
                        {column.actionCredentials.map(actionType => (
                            <ActionBox key={actionType.name}>
                                <ActionBoxHeader>
                                    <Typography variant='h5' textTransform='uppercase'>
                                        {actionType.name}
                                    </Typography>
                                </ActionBoxHeader>
                                <ActionBoxContent>
                                    {actionType.credentials.map(cred => (
                                        <ActionCredential
                                            key={cred.name}
                                            isPrimary={cred.order === 1}
                                            credentialName={cred.name}
                                            credentialId={cred.id}
                                            collectionName={cred.collectionName}
                                            handleDeleteDialog={handleDeleteDialogOpen}
                                        />
                                    ))}
                                    <ActionCredentialAdd handleClick={handleEditDialogOpen}/>
                                </ActionBoxContent>
                            </ActionBox>
                        ))}
                    </ActionsColumns>
                ))}
            </ActionsContainer>
        </Container>
    );
};

export default ProcessCredentials;
