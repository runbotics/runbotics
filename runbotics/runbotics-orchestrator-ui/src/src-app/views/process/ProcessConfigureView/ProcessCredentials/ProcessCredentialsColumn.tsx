import { FC, useState } from 'react';

import { closestCenter, DndContext } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import Typography from '@mui/material/Typography';

import { useSnackbar } from 'notistack';

import { translate } from '#src-app/hooks/useTranslations';
import { useDispatch } from '#src-app/store';
import { credentialsActions } from '#src-app/store/slices/Credentials';


import { processActions } from '#src-app/store/slices/Process';

import { getTranslatedTemplateName } from '#src-app/views/credentials/Credential/Credential.utils';

import ActionCredential from './ActionCredential';
import ActionCredentialAdd from './ActionCredentialAdd';
import { ActionBox, ActionBoxContent, ActionBoxHeader } from './ProcessCredentials.styles';
import { CredentialInAction } from './ProcessCredentials.types';
import { changeCredentialOrder } from './ProcessCredentials.utils';

interface ProcessCredentialProps {
    actionType: {
        name: string;
        credentials: CredentialInAction[];
    };
    processId: string;
    handleAddDialogOpen: (actionName: string) => void;
    handleDeleteDialogOpen: (credentialId: string) => void
};

export const ProcessCredentialsColumn: FC<ProcessCredentialProps> = ({
    actionType,
    processId,
    handleAddDialogOpen,
    handleDeleteDialogOpen
}) => {
    const [isUpdating, setIsUpadating] = useState(false);
    const credentials = actionType.credentials;
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();

    const handleDragEnd = ({ active, over }: any) => {
        if (!over) return;

        const oldIndex = credentials.findIndex((item) => item.name === active.id);
        const newIndex = credentials.findIndex((item) => item.name === over.id);

        if (oldIndex === newIndex) return;

        setIsUpadating(true);
        const updatedCredentials = changeCredentialOrder(credentials, oldIndex, newIndex);

        const payload = updatedCredentials.map((credential, idx ) => ({ id: credential.id, order: idx + 1 }));

        dispatch(credentialsActions.updateCredentialsAssignedToProcess({ resourceId: processId, payload }))
            .unwrap()
            .then(() => {
                dispatch(processActions.getProcessCredentials({ resourceId: processId }))
                    .finally(() => {
                        setIsUpadating(false);
                    });
            }).catch(() => {
                enqueueSnackbar(translate('Process.Configure.Credentials.ChangeOrder.Info.Error'), {variant: 'error'});
            });
    };

    return (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <ActionBox $isUpdating={isUpdating}>
                <ActionBoxHeader>
                    <Typography variant="h5" textTransform="uppercase">
                        {getTranslatedTemplateName(actionType.name)}
                    </Typography>
                </ActionBoxHeader>
                <SortableContext items={credentials.map((cred) => cred.name)} disabled={isUpdating}>
                    <ActionBoxContent>
                        {credentials.map((cred) => (
                            <ActionCredential
                                key={cred.name}
                                id={cred.name}
                                credentialName={cred.name}
                                credentialId={cred.id}
                                collectionName={cred.collectionName}
                                authorName={cred.authorName}
                                isPrimary={cred.order === 1}
                                handleDeleteDialog={handleDeleteDialogOpen}
                            />
                        ))}
                        <ActionCredentialAdd handleClick={() => handleAddDialogOpen(actionType.name)} />
                    </ActionBoxContent>
                </SortableContext>
            </ActionBox>
        </DndContext>
    );
};
