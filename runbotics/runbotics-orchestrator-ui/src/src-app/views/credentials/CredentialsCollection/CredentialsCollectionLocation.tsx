import { FC } from 'react';

import HomeOutlined from '@mui/icons-material/HomeOutlined';
import { Box, Breadcrumbs, Typography } from '@mui/material';
import Link from 'next/link';
import styled from 'styled-components';


const StyledLink = styled(Link)`
    text-decoration: none;
    color: black;
`;

interface CredentialsCollectionLocationProps {
    collectionName: string;
}

const CredentialsCollectionLocation: FC<CredentialsCollectionLocationProps> = ({ collectionName }) => (
    <Box mt={3} display="flex" alignContent="center">
        <Breadcrumbs>
            <StyledLink href={{
                pathname: '/app/credentials/collections',
            }}>
                <Box display="flex" alignContent="center">
                    <HomeOutlined fontSize="medium"/>
                </Box>
            </StyledLink>
            <Typography variant="body1" color="secondary">{collectionName}</Typography>
        </Breadcrumbs>
    </Box>
);
export default CredentialsCollectionLocation;
