import React, { FC } from 'react';

import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Divider, Grid, Typography, Box } from '@mui/material';
import { useRouter } from 'next/router';

import { AccessType, FrontCredentialCollectionDto, Role } from 'runbotics-common';

import If from '#src-app/components/utils/If';
import useAuth from '#src-app/hooks/useAuth';
import useRole from '#src-app/hooks/useRole';
import useTranslations from '#src-app/hooks/useTranslations';

import { ColorDot } from '#src-app/views/credentials/CredentialsCollection/EditCredentialsCollection/CollectionColor/CollectionColor.styles';

import { CredentialCollectionCard, CredentialCollectionCardontainer, ShareOptionSpan } from './CredentialsCollectionTile.style';
import MenuItems from './MenuItems/MenuItems';
import Tile from '../Tile';

interface CredentialsCollectionTileProps {
    collection: FrontCredentialCollectionDto;
    handleOpenEditDialog(id: string): void;
    handleOpenDeleteDialog(id: string): void;
    setCurrentDialogCollection(collection: FrontCredentialCollectionDto): void;
}

const CredentialsCollectionTile: FC<CredentialsCollectionTileProps> = ({
    collection,
    handleOpenEditDialog,
    handleOpenDeleteDialog,
    setCurrentDialogCollection
}) => {
    const router = useRouter();
    const { translate } = useTranslations();
    const { user: currentUser } = useAuth();
    const isOwner = collection.createdById === currentUser.id;
    const isTenantAdmin = useRole([Role.ROLE_TENANT_ADMIN]);

    const handleCardClick = () => {
        setCurrentDialogCollection(collection);
        router.push(`/app/credentials?collectionId=${collection.id}`);
    };

    return (
        <CredentialCollectionCardontainer>
            <Tile>
                <CredentialCollectionCard onClick={handleCardClick}>
                    <Box display="flex">
                        <ColorDot collectionColor={collection.color} />
                        <Typography variant="h4">{collection.name}</Typography>
                    </Box>
                    <Grid container spacing={2} marginTop="0.5rem" minHeight="160px">
                        <Grid item xs={5}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant="h6">{translate('Credentials.Collection.Tile.CreatedDate.Label')}</Typography>
                                    <Typography variant="body2">{collection.createdAt.slice(0, 10)}</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="h6">{translate('Credentials.Collection.Tile.Owner.Label')}</Typography>
                                    <Typography variant="body2">{collection.createdBy.email}</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={1}>
                            <Divider orientation="vertical" flexItem sx={{ height: '100%', width: '100%' }} />
                        </Grid>
                        <Grid item xs={5}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant="h6">{translate('Credentials.Collection.Tile.UpdatedDate.Label')}</Typography>
                                    <Typography variant="body2">
                                        {collection.updatedAt
                                            ? collection.updatedAt.slice(0, 10)
                                            : translate('Credentials.Collection.Tile.UpdatedDate.DefaultValue')}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="h6">{translate('Credentials.Collection.Tile.ShareOption.Label')}</Typography>
                                    <If condition={collection.accessType === AccessType.PRIVATE}>
                                        <ShareOptionSpan>
                                            <LockOutlinedIcon/>
                                            <Typography variant="body2">
                                                {translate('Credentials.Collection.Tile.ShareOption.Private')}
                                            </Typography>
                                        </ShareOptionSpan>
                                    </If>
                                    <If condition={collection.accessType === AccessType.GROUP}>
                                        <ShareOptionSpan>
                                            <GroupsOutlinedIcon/>
                                            <Typography variant="body2">
                                                {translate('Credentials.Collection.Tile.ShareOption.GroupAccess')}
                                            </Typography>
                                        </ShareOptionSpan>
                                    </If>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Divider sx={{ marginTop: '2rem' }} />
                    <Box minHeight="66px">
                        <If condition={isOwner || isTenantAdmin}>
                            <MenuItems
                                itemId={collection?.id}
                                handleOpenEditDialog={handleOpenEditDialog}
                                handleOpenDeleteDialog={handleOpenDeleteDialog}
                            />
                        </If>
                    </Box>
                </CredentialCollectionCard>
            </Tile>
        </CredentialCollectionCardontainer>
    );
};

export default CredentialsCollectionTile;
