import { FC } from 'react';

import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import { Box, CircularProgress, Typography } from '@mui/material';

import { useRouter } from 'next/router';

import { PrivilegeType, DEFAULT_COLLECTION_COLOR, FrontCredentialDto, FrontCredentialCollectionDto } from 'runbotics-common';

import If from '#src-app/components/utils/If';
import useAuth from '#src-app/hooks/useAuth';
import useTranslations from '#src-app/hooks/useTranslations';
import { getTranslatedTemplateName } from '#src-app/views/credentials/Credential/Credential.utils';
import { collectionColors } from '#src-app/views/credentials/CredentialsCollection/EditCredentialsCollection/CollectionColor/CollectionColor.utils';


import { CredentialCard, CredentialCardContainer, CredentialCollection } from './CredentialTile.styles';
import MenuItems from '../CredentialsCollectionTile/MenuItems/MenuItems';
import Tile from '../Tile';

export interface CredentialTileProps {
    credential: FrontCredentialDto;
    collection: FrontCredentialCollectionDto;
    templateName: string;
    loading: boolean;
    collectionId: string;
    handleEditDialogOpen(id: string): void;
    handleDeleteDialogOpen(id: string): void;
}

const CredentialTile: FC<CredentialTileProps> = ({
    credential,
    collection,
    templateName,
    loading,
    collectionId,
    handleEditDialogOpen,
    handleDeleteDialogOpen
}) => {
    const router = useRouter();
    const { translate } = useTranslations();
    const { user: currentUser } = useAuth();
    const isOwner = collection ? collection.createdById === currentUser.id : false;
    const hasEditAccess = collection?.credentialCollectionUser.some(
        user => user.user.email === currentUser.email &&
        user.privilegeType === PrivilegeType.WRITE
    );
    const hexColor = collection ? collectionColors[collection?.color].hex : collectionColors[DEFAULT_COLLECTION_COLOR].hex;
    const template = getTranslatedTemplateName(templateName);

    if (loading) return <CircularProgress />;

    const handleClick = () => {
        router.push(`/app/credentials/${credential.id}`);
    };

    return (
        <CredentialCardContainer onClick={handleClick}>
            <Tile leftbordercolor={`4px solid ${hexColor}`}>
                <CredentialCard>
                    <Typography variant="h4" sx={{ paddingBottom: '16px' }}>
                        {credential.name}
                    </Typography>
                    <If condition={!!collectionId && !!credential.description}>
                        <Typography mb={1}>
                            {translate('Credential.Details.Description.Label')}: {credential.description}
                        </Typography>
                    </If>
                    <Typography mb={1}>
                        {translate('Credential.Details.Template.Label')}: {template}
                    </Typography>
                    <If condition={!collectionId}>
                        <CredentialCollection>
                            <FolderOpenIcon sx={{ paddingRight: '4px' }} />
                            {collection.name}
                        </CredentialCollection>
                    </If>
                </CredentialCard>
                <Box>
                    <If condition={isOwner || hasEditAccess}>
                        <MenuItems
                            itemId={credential?.id}
                            handleOpenEditDialog={handleEditDialogOpen}
                            handleOpenDeleteDialog={handleDeleteDialogOpen}
                        />
                    </If>
                </Box>
            </Tile>
        </CredentialCardContainer>
    );
};

export default CredentialTile;
