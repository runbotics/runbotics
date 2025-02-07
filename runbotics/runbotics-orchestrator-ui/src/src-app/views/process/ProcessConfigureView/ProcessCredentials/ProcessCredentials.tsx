import { useEffect, useMemo, useState, FC } from 'react';

import { Box, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';

import LockIcon from '#public/images/icons/lock.svg';
import { useRequiredCredentialTypes } from '#src-app/credentials/useRequiredCredentialTypes';
import useTranslations from '#src-app/hooks/useTranslations';
import useWindowSize from '#src-app/hooks/useWindowSize';
import { useDispatch, useSelector } from '#src-app/store';
import { credentialTemplatesActions, credentialTemplatesSelector } from '#src-app/store/slices/CredentialTemplates';
import { processActions, processSelector } from '#src-app/store/slices/Process';

import {
    ActionsColumns,
    ActionsContainer, Container, Header, StyledImage,
} from './ProcessCredentials.styles';
import { ActionSortedColumns, CredentialId } from './ProcessCredentials.types';
import {
    ACTION_MIN_WIDTH,
    MARGIN_LIMIT,
    sortByActionCredentialType,
    sortByColumns,
} from './ProcessCredentials.utils';
import { ProcessCredentialsAddDialog } from './ProcessCredentialsAddDialog';
import { ProcessCredentialsColumn } from './ProcessCredentialsColumn';
import { ProcessCredentialsDeleteDialog } from './ProcessCredentialsDeleteDialog';

interface ProcessCredentialsProps {
    canConfigure: boolean;
}

const ProcessCredentials: FC<ProcessCredentialsProps> = ({ canConfigure }) => {
    const { enqueueSnackbar } = useSnackbar();
    const { translate } = useTranslations();
    const dispatch = useDispatch();
    const { id: processId } = useRouter().query;
    const { draft: { credentials: processCredentials } } = useSelector(processSelector);
    const credentialTypes = useRequiredCredentialTypes();
    const actionCredentials = useMemo(
        () => credentialTypes ? sortByActionCredentialType(processCredentials, credentialTypes) : null,
        [processCredentials, credentialTypes]
    );

    const [columns, setColumns] = useState<ActionSortedColumns>([]);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [currentCredentialId, setCurrentCredentialId] = useState<CredentialId>(null);
    const [currentActionName, setCurrentActionName] = useState<string | null>(null);
    const { credentialTemplates } = useSelector(credentialTemplatesSelector);


    const { width: windowWidth } = useWindowSize();
    const rowCount = Math.max(Math.ceil((Math.abs(windowWidth - MARGIN_LIMIT)) / ACTION_MIN_WIDTH), 1);


    const handleDelete = () => {
        dispatch(processActions.deleteProcessCredential({ resourceId: currentCredentialId }))
            .unwrap()
            .then(() => {
                enqueueSnackbar(
                    translate('Process.Configure.Credentials.Modal.Delete.Info.Success'),
                    { variant: 'success' }
                );
                dispatch(processActions.getProcessCredentials({ resourceId: String(processId) }));
            })
            .catch(() => {
                enqueueSnackbar(
                    translate('Process.Configure.Credentials.Modal.Delete.Info.Error'),
                    { variant: 'error' }
                );
            });

        setIsDeleteDialogOpen(false);
    };

    const handleAddDialogOpen = (actionName: string) => {
        setCurrentActionName(actionName);
        setIsAddDialogOpen(true);
    };

    const handleAddDialogClose = () => {
        setIsAddDialogOpen(false);
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
        dispatch(credentialTemplatesActions.fetchAllTemplates());
    }, []);

    return (
        <Box sx={!canConfigure && { pointerEvents: 'none', opacity: 0.7 }}>
            <Container>
                <ProcessCredentialsDeleteDialog
                    isOpen={isDeleteDialogOpen}
                    handleClose={handleDeleteDialogClose}
                    handleDelete={handleDelete}
                />
                <ProcessCredentialsAddDialog
                    isOpen={isAddDialogOpen}
                    handleClose={handleAddDialogClose}
                    templateName={currentActionName}
                />
                <Header>
                    <StyledImage
                        src={LockIcon}
                        alt={translate('Process.Configure.Credentials.Section.Icon.Alt')}
                        style={{ filter: 'brightness(0) saturate(100%)' }}
                    />
                    <Typography>{translate('Process.Configure.Credentials.Section.Title')}</Typography>
                </Header>
                <ActionsContainer $rowCount={rowCount}>
                    {columns.map((column, idx) => (
                        <ActionsColumns key={column.count + String(idx)}>
                            {column.actionCredentials.map(actionType => {
                                const templateId = credentialTemplates?.find(template => template.name === actionType.name).id;

                                return (
                                    <ProcessCredentialsColumn
                                        key={actionType.name}
                                        actionType={actionType}
                                        processId={String(processId)}
                                        templateId={templateId}
                                        handleAddDialogOpen={handleAddDialogOpen}
                                        handleDeleteDialogOpen={handleDeleteDialogOpen}
                                    />);
                            })}
                        </ActionsColumns>
                    ))}
                </ActionsContainer>
            </Container>
        </Box>
    );
};

export default ProcessCredentials;
