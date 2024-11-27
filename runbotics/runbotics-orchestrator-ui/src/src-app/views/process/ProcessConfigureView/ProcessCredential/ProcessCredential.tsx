import { FC, useState } from 'react';

import { closestCenter, DndContext } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import Typography from '@mui/material/Typography';

import ActionCredential from '../ProcessCredentials/ActionCredential';
import ActionCredentialAdd from '../ProcessCredentials/ActionCredentialAdd';
import { ActionBox, ActionBoxContent, ActionBoxHeader } from '../ProcessCredentials/ProcessCredentials.styles';
import { CredentialInAction } from '../ProcessCredentials/ProcessCredentials.types';

interface ProcessCredentialProps {
    actionType: {
        name: string;
        credentials: CredentialInAction[];
    };
    handleAddDialogOpen: (actionName: string) => void;
    handleDeleteDialogOpen: (credentialId: string) => void
};

export const ProcessCredential: FC<ProcessCredentialProps> = ({ actionType, handleAddDialogOpen, handleDeleteDialogOpen }) => {
    const [credentials, setCredentials] = useState(actionType.credentials);

    // Handle Drag End
    const handleDragEnd = ({ active, over }: any) => {
        if (!over) return; // If no target was found, return.

        const oldIndex = credentials.findIndex((item) => item.name === active.id);
        const newIndex = credentials.findIndex((item) => item.name === over.id);

        // Only update if the positions are different.
        if (oldIndex !== newIndex) {
            const updatedCredentials = arrayMove(credentials, oldIndex, newIndex);
            setCredentials(updatedCredentials); // Update the state with the new order.

            console.log(oldIndex, newIndex);

            console.log(credentials);
            // dispatch action to update credential as primary - to think how can I use credential.order
            // oldIndex + 1 matches the credential.order in db
            // i think i need to send all credentials list with order defined
            // biut I need to check it how it is implemented on the backend
        }
    };

    return (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <ActionBox>
                <ActionBoxHeader>
                    <Typography variant="h5" textTransform="uppercase">
                        {actionType.name}
                    </Typography>
                </ActionBoxHeader>
                <SortableContext items={credentials.map((cred) => cred.name)}>
                    <ActionBoxContent>
                        {credentials.map((cred) => (
                            <ActionCredential
                                key={cred.name}
                                id={cred.name} // Ensure each item has a unique id
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

// Utility to reorder items in an array based on drag-and-drop
const arrayMove = (array: any[], fromIndex: number, toIndex: number) => {
    const item = array[fromIndex];
    const newArray = [...array];
    newArray.splice(fromIndex, 1);
    newArray.splice(toIndex, 0, item);
    return newArray;
};

