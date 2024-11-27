import { FunctionComponent } from 'react';

import { useSortable } from '@dnd-kit/sortable';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { Divider, List, ListItem, Typography } from '@mui/material';

import If from '#src-app/components/utils/If';
import useTranslations from '#src-app/hooks/useTranslations';

import { CredentialDelete, CredentialDetails, CredentialSwipe, CredentialTile, CredentialWrapper, HorizontalLine, StyledTypography } from './ActionCredential.styles';

interface ActionCredentialProps {
    isPrimary: boolean;
    collectionName: string;
    credentialName: string;
    authorName: string;
    credentialId: string;
    handleDeleteDialog: (credentialId: string) => void;
    id: string;
};

const ActionCredential: FunctionComponent<ActionCredentialProps> = ({
    isPrimary, collectionName, credentialName, authorName, credentialId, handleDeleteDialog, id
}) => {
    const { translate } = useTranslations();

    // const {attributes, listeners, setNodeRef, transform} = useDraggable({
    //     id: 'draggable',
    // });
    // const style = transform ? {
    //     transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    // } : undefined;

    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    const style = {
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        transition,
        cursor: 'grab',
    };

    return (
        <CredentialWrapper>
            <If condition={isPrimary}>
                <StyledTypography
                    fontWeight={500}
                    variant='caption'
                >
                    {translate('Process.Configure.Credentials.Action.PrimaryCredential')}
                </StyledTypography>
            </If>
            <CredentialTile $isPrimary={isPrimary} {...listeners} {...attributes} ref={setNodeRef} id={id} style={style}>
                <CredentialSwipe>
                    <DragIndicatorIcon sx={{ fontSize: '30px', [':hover']: { cursor: 'pointer' } }}/>
                </CredentialSwipe>
                <CredentialDetails>
                    <List sx={{ display: 'flex', flexDirection: 'column', flexGrow: '1' }}>
                        <ListItem>
                            <Typography
                                sx={{ wordBreak: 'break-word' }}
                            >
                                {collectionName}
                            </Typography>
                        </ListItem>
                        <Divider component='li' variant='middle'/>
                        <ListItem>
                            <Typography
                                fontSize={18}
                                fontWeight={500}
                                textTransform='uppercase'
                                sx={{ wordBreak: 'break-word' }}
                            >
                                {credentialName}
                            </Typography>
                        </ListItem>
                        <ListItem sx={{ paddingTop: 0 }}>
                            <Typography
                                fontSize={12}
                                color='gray'
                            >
                                {authorName}
                            </Typography>
                        </ListItem>
                    </List>
                </CredentialDetails>
                <CredentialDelete>
                    <DeleteOutlineIcon
                        color={isPrimary ? 'disabled' : 'error'}
                        sx={{[':hover']: { cursor: 'pointer' } }}
                        onClick={() => handleDeleteDialog(credentialId)}
                        // Two lines to change after drag & drop (edit) functionality will be added
                        // {...(!isPrimary && { onClick: () => handleDeleteDialog(credentialId) })}
                        // sx={{...(!isPrimary && { [':hover']: { cursor: 'pointer' } })}}
                    />
                </CredentialDelete>
            </CredentialTile>
            <If condition={isPrimary}>
                <HorizontalLine/>
            </If>
        </CredentialWrapper>
    );
};

export default ActionCredential;
