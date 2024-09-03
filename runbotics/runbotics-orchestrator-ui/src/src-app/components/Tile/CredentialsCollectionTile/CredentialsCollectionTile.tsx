import React, { FC } from 'react';

import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Divider, Grid, Typography, Box } from '@mui/material';
import { useRouter } from 'next/router';

import If from '#src-app/components/utils/If';
import useTranslations from '#src-app/hooks/useTranslations';

import { useSelector } from '#src-app/store';
import { AccessType, PrivilegeType } from '#src-app/views/credentials/CredentialsCollection/CredentialsCollection.types';


import { ColorDot, CredentialCollectionCard, ShareOptionSpan } from './CredentialsCollectionTile.style';
import { CredentialsCollectionTileProps } from './CredentialsCollectionTile.types';
import MenuItems from './MenuItems/MenuItems';
import Tile from '../Tile';

const CredentialsCollectionTile: FC<CredentialsCollectionTileProps> = ({ collection, handleOpenEditDialog, handleOpenDeleteDialog, setCurrentDialogCollection }) => {
    const router = useRouter();
    const { translate } = useTranslations();
    const { user: currentUser } = useSelector(state => state.auth);
    const isOwner = parseInt(collection.createdById) === currentUser.id;
    const hasEditAccess =
        collection.credentialCollectionUser.length > 1
            ? collection.credentialCollectionUser.some(
                user => user.user.email === currentUser.email && user.privilegeType === PrivilegeType.WRITE
            )
            : false;

    const handleCardClick = () => {
        setCurrentDialogCollection(collection);
        router.push(`/app/credentials/collections/${collection.id}?collectionId=${collection.id}`);
    };

    return (
        <>
            <Tile>
                <CredentialCollectionCard onClick={handleCardClick}>
                    <Box display="flex">
                        <ColorDot collectionColor={collection.color} />
                        <Typography variant="h4">{collection.name}</Typography>
                    </Box>
                    <Grid container spacing={2} marginTop="0.5rem" alignItems="stretch">
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
                                            <LockOutlinedIcon sx={{ marginRight: '8px' }} />
                                            <Typography variant="body2">
                                                {translate('Credentials.Collection.Tile.ShareOption.Private')}
                                            </Typography>
                                        </ShareOptionSpan>
                                    </If>
                                    <If condition={collection.accessType === AccessType.GROUP}>
                                        <ShareOptionSpan>
                                            <GroupsOutlinedIcon sx={{ marginRight: '8px' }} />
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
                    <If condition={isOwner || hasEditAccess}>
                        <MenuItems collectionId={collection?.id} 
                            handleOpenEditDialog={handleOpenEditDialog}
                            handleOpenDeleteDialog={handleOpenDeleteDialog}
                        />
                    </If>
                </CredentialCollectionCard>
            </Tile>
        </>
    );
};

export default CredentialsCollectionTile;
