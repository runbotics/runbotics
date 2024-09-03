// import { useRouter } from 'next/router';

import { FC, useEffect, useState } from 'react';

import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import { CircularProgress, Typography } from '@mui/material';

import { useRouter } from 'next/router';

import { collectionColors } from '#src-app/views/credentials/CredentialsCollection/EditCredentialsCollection/CollectionColor/CollectionColor.types';

import { CredentialCard, CredentialCollection } from './CredentialTile.styles';
import { CredentialTileProps } from './CredentialTile.types';
import Tile from '../Tile';

const CredentialTile: FC<CredentialTileProps> = ({ credential, collection, templateName, collectionName }) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [collectionColor, setCollectionColor] = useState(null);

    useEffect(() => {
        if (collection) {
            setCollectionColor(collection.color);
            setLoading(false);
        }
    }, [collection]);

    if (loading) {
        return <CircularProgress />;
    }

    const handleClick = () => {
        router.push(`/app/credentials/${credential.id}`);
    };

    return (
        <Tile minHeight="10rem">
            <CredentialCard collectionColor={collectionColors[collectionColor].hex} onClick={handleClick}>
                <Typography variant="h4" sx={{ paddingBottom: '16px' }}>
                    {credential.name}
                </Typography>
                <Typography sx={{ mb: 1 }}>
                    action group: {templateName}
                </Typography>
                <CredentialCollection>
                    <FolderOpenIcon sx={{ paddingRight: '4px' }} />
                    {collectionName}
                </CredentialCollection>
            </CredentialCard>
        </Tile>
    );
};

export default CredentialTile;
