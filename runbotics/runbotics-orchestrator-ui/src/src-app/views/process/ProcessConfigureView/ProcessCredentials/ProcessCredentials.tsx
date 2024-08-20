import { useEffect, useMemo, useState } from 'react';

import { Typography } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/router';

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

const ACTION_MIN_WIDTH = 400;
const MARGIN_LIMIT = 800;

const ProcessCredentials = () => {
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

    const { width: windowWidth } = useWindowSize();
    const rowCount = Math.ceil((Math.abs(windowWidth - MARGIN_LIMIT)) / ACTION_MIN_WIDTH);

    const handleDialogOpen = () => {
        setIsEditDialogOpen(true);
    };

    const handleDialogClose = () => {
        setIsEditDialogOpen(false);
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
            <ProcessCredentialsAddDialog
                isOpen={isEditDialogOpen}
                handleClose={handleDialogClose}
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
                                    <Typography variant='h5' textTransform='uppercase'>{actionType.name}</Typography>
                                </ActionBoxHeader>
                                <ActionBoxContent>
                                    {actionType.credentials.map(cred => (
                                        <ActionCredential
                                            key={cred.name}
                                            isPrimary={cred.order === 1}
                                            credentialName={cred.name}
                                            collectionName={cred.collectionName}
                                        />

                                    ))}
                                    <ActionCredentialAdd handleClick={handleDialogOpen}/>
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
