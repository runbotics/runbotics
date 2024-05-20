import React, { FC, useState } from 'react';

import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import { Divider, Grid, Typography, Box, IconButton } from '@mui/material';
import { useRouter } from 'next/router';

import If from '#src-app/components/utils/If';
import useTranslations from '#src-app/hooks/useTranslations';

import CredentialsCollectionModifyDialog from '#src-app/views/credentials/CredentialsCollection/CredentialsCollectionModifyDialog';

import { ColorDot, CredentialCollectionCard, ShareOptionSpan } from './CredentialsCollectionTile.style';
import { CredentialsCollectionTileProps } from './CredentialsCollectionTile.types';
import Tile from '../Tile';

const CredentialsCollectionTile: FC<CredentialsCollectionTileProps> = ({ collection }) => {
    const router = useRouter();
    const { translate } = useTranslations();
    const [showCollectionDialog, setShowCollectionDialog] = useState(false);

    const handleCardClick = () => {
        router.push(`/app/credentials/collections/${collection.id}`);
    };

    const handleMenuClick = () => {
        setShowCollectionDialog(true);
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
                                    <Typography variant="body2">{collection.createdOn}</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="h6">{translate('Credentials.Collection.Tile.Owner.Label')}</Typography>
                                    <Typography variant="body2">{collection.createdBy}</Typography>
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
                                        {collection.modifiedOn
                                            ? collection.modifiedOn
                                            : translate('Credentials.Collection.Tile.UpdatedDate.DefaultValue')}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="h6">{translate('Credentials.Collection.Tile.ShareOption.Label')}</Typography>
                                    <If condition={collection.isPrivate}>
                                        <ShareOptionSpan>
                                            <LockOutlinedIcon sx={{ marginRight: '8px' }} />
                                            <Typography variant="body2">
                                                {translate('Credentials.Collection.Tile.ShareOption.Private')}
                                            </Typography>
                                        </ShareOptionSpan>
                                    </If>
                                    <If condition={!collection.isPrivate}>
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
                            onClick={e => {
                                e.stopPropagation();
                                handleMenuClick();
                            }}
                        >
                            <MoreVertOutlinedIcon />
                        </IconButton>
                    </Box>
                </CredentialCollectionCard>
            </Tile>
            <CredentialsCollectionModifyDialog
                open={showCollectionDialog}
                onClose={() => setShowCollectionDialog(false)}
                collection={{
                    name: collection.name,
                    color: collection.color,
                    credentials: collection.credentials,
                    isPrivate: collection.isPrivate,
                    description: collection.description,
                    users: collection.users
                }}
            />
        </>
    );
};

export default CredentialsCollectionTile;
