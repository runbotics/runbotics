import React, { FC, useEffect } from 'react';

import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Divider, Grid, Typography, Box, IconButton, Menu } from '@mui/material';
import { useRouter } from 'next/router';

import If from '#src-app/components/utils/If';
import useTranslations from '#src-app/hooks/useTranslations';

import { useSelector } from '#src-app/store';
import { AccessType } from '#src-app/views/credentials/CredentialsCollection/CredentialsCollection.types';

import { ColorDot, CredentialCollectionCard, ShareOptionSpan } from './CredentialsCollectionTile.style';
import { CredentialsCollectionTileProps } from './CredentialsCollectionTile.types';
import { CredentialCollectionDelete } from './MenuItems/CredentialCollectionDelete';
import { CredentialCollectionEdit } from './MenuItems/CredentialCollectionEdit';
import Tile from '../Tile';

const CredentialsCollectionTile: FC<CredentialsCollectionTileProps> = ({ collection }) => {
    const router = useRouter();
    const { translate } = useTranslations();
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement>(null);
    const { user: currentUser } = useSelector(state => state.auth);
    const isOwner = parseInt(collection.createdById) === currentUser.id;

    const handleCardClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if ((event.target as HTMLElement).closest('.menu-container')) {
            return;
        }
        router.push(`/app/credentials/collections/${collection.id}`);
    };

    useEffect(() => {
        // console.log('rendered');
    }, [collection]);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (event?: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        setAnchorEl(null);
    };

    return (
        <>
            <Tile>
                <CredentialCollectionCard onClick={e => handleCardClick(e)}>
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
                                    {/* TO_REVIEW after return object is modified and have createdBy.email */}
                                    <Typography variant="body2">{collection.createdById}</Typography>
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
                    <Box display="flex" justifyContent="flex-end" padding="0.5rem" paddingBottom="0">
                        <IconButton
                            disabled={!isOwner}
                            onClick={e => {
                                e.stopPropagation();
                                handleClick(e);
                            }}
                        >
                            <MoreVertIcon />
                        </IconButton>
                        <Menu
                            id="credential-collection-actions-menu"
                            anchorEl={anchorEl}
                            open={!!anchorEl}
                            onClose={handleClose}
                            MenuListProps={{
                                onClick: e => e.stopPropagation()
                            }}
                        >
                            <CredentialCollectionEdit collection={collection} handleClose={handleClose} />
                            <CredentialCollectionDelete
                                id={collection.id}
                                name={collection.name}
                                isOwner={isOwner}
                                credentials={collection.credentials}
                                handleClose={handleClose}
                            />
                        </Menu>
                    </Box>
                </CredentialCollectionCard>
            </Tile>
        </>
    );
};

export default CredentialsCollectionTile;
