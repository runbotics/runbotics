// import { useRouter } from 'next/router';

import { FC } from 'react';

import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import { Box, CircularProgress, IconButton, Typography } from '@mui/material';

import { useRouter } from 'next/router';

import If from '#src-app/components/utils/If';
import { useSelector } from '#src-app/store';
import { BasicCredentialDto } from '#src-app/views/credentials/Credential/Credential.types';
import { BasicCredentialsCollectionDto, PrivilegeType } from '#src-app/views/credentials/CredentialsCollection/CredentialsCollection.types';
import { collectionColors } from '#src-app/views/credentials/CredentialsCollection/EditCredentialsCollection/CollectionColor/CollectionColor.types';

import { CredentialCard, CredentialCollection } from './CredentialTile.styles';
import Tile from '../Tile';

export interface CredentialTileProps {
    credential: BasicCredentialDto;
    collection: BasicCredentialsCollectionDto;
    templateName: string;
    collectionName: string;
    loading: boolean;
    collectionId: string;
    handleDeleteDialogOpen(id: string): void;
}


const CredentialTile: FC<CredentialTileProps> = ({ credential, collection, templateName, collectionName, loading, collectionId, handleDeleteDialogOpen }) => {
    const router = useRouter();
    const { user: currentUser } = useSelector(state => state.auth);
    const isOwner = parseInt(collection.createdById) === currentUser.id;
    const hasEditAccess =
        collection.credentialCollectionUser.length > 1
            ? collection.credentialCollectionUser.some(
                user => user.user.email === currentUser.email && user.privilegeType === PrivilegeType.WRITE
            )
            : false;

    if (loading) return <CircularProgress />;

    const handleClick = () => {
        router.push(`/app/credentials/${credential.id}`);
    };

    return (
        <Tile leftBorderColor={`4px solid ${collectionColors[collection.color].hex}`}>
            <CredentialCard collectionColor={collectionColors[collection.color].hex} onClick={handleClick}>
                <Typography variant="h4" sx={{ paddingBottom: '16px' }}>
                    {credential.name}
                </Typography>
                <If condition={!!collectionId}>
                    <Typography sx={{ mb: 1 }}>
                    description: {credential.description}
                    </Typography>
                </If>
                <Typography sx={{ mb: 1 }}>
                    action group: {templateName}
                </Typography>
                <If condition={!collectionId}>
                    <CredentialCollection>
                        <FolderOpenIcon sx={{ paddingRight: '4px' }} />
                        {collectionName}
                    </CredentialCollection>
                </If>
                <If condition={collectionId && (isOwner || hasEditAccess)}>
                    <Box alignSelf='flex-end'>
                        <IconButton onClick={e => {
                            e.stopPropagation();
                            handleDeleteDialogOpen(credential.id);
                        }}>
                            <DeleteOutlineOutlinedIcon/>
                        </IconButton>
                    </Box>
                </If>
            </CredentialCard>
        </Tile>
    );
};

export default CredentialTile;
