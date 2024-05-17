// import { useRouter } from 'next/router';

import { FC } from 'react';

import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import { Typography } from '@mui/material';

import { useRouter } from 'next/router';


import { CredentialCard, CredentialCollection } from './CredentialTile.styles';
import { CredentialTileProps } from './CredentialTile.types';
import Tile from '../Tile';

const CredentialTile: FC<CredentialTileProps> = ({credential}) => {
    const router = useRouter();

    const handleClick = () => {
        router.push(`/app/credentials/${credential.id}`);
    };

    return (
        <Tile minHeight="10rem" >
            <CredentialCard collectionColor={credential.collectionColor} onClick={handleClick}>
                <Typography variant="h4" sx={{paddingBottom: '8px' }}>
                    {credential.name}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">   
                    {credential.id}
                </Typography>
                <CredentialCollection>
                    <FolderOpenIcon sx={{paddingRight: '4px'}}/>
                    {credential.collectionName}
                </CredentialCollection>
            </CredentialCard>
        </Tile>
    );
};

export default CredentialTile;
