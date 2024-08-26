import { FunctionComponent } from 'react';

import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { Divider, List, ListItem, Typography } from '@mui/material';

import If from '#src-app/components/utils/If';

import { CredentialDelete, CredentialDetails, CredentialSwipe, CredentialTile, CredentialWrapper, HorizontalLine, StyledTypography } from './ActionCredential.styles';

interface ActionCredentialProps {
    isPrimary: boolean;
    collectionName: string;
    credentialName: string;
    credentialId: string;
    handleDeleteDialog: (credentialId: string) => void;
};

const ActionCredential: FunctionComponent<ActionCredentialProps> = ({
    isPrimary, collectionName, credentialName, credentialId, handleDeleteDialog
}) => (
    <CredentialWrapper>
        <If condition={isPrimary}>
            <StyledTypography
                fontWeight={500}
                variant='caption'
            >
                Primary
            </StyledTypography>
        </If>
        <CredentialTile $isPrimary={isPrimary}>
            <CredentialSwipe>
                <DragIndicatorIcon sx={{ fontSize: '30px', [':hover']: { cursor: 'pointer' } }}/>
            </CredentialSwipe>
            <CredentialDetails>
                <List sx={{ display: 'flex', flexDirection: 'column', flexGrow: '1' }}>
                    <ListItem>
                        <Typography>{collectionName}</Typography>
                    </ListItem>
                    <Divider component='li' variant='middle'/>
                    <ListItem>
                        <Typography
                            fontSize={18}
                            fontWeight={500}
                            textTransform='uppercase'
                        >
                            {credentialName}
                        </Typography>
                    </ListItem>
                </List>
            </CredentialDetails>
            <CredentialDelete>
                <DeleteOutlineIcon
                    sx={{...(!isPrimary && { [':hover']: { cursor: 'pointer' } })}}
                    color={isPrimary ? 'disabled' : 'error'}
                    {...(!isPrimary && { onClick: () => handleDeleteDialog(credentialId) })}
                />
            </CredentialDelete>
        </CredentialTile>
        <If condition={isPrimary}>
            <HorizontalLine/>
        </If>
    </CredentialWrapper>
);

export default ActionCredential;
