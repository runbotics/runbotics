import { VFC, useEffect } from 'react';

import { Box } from '@mui/material';
import { useRouter } from 'next/router';

import { useDispatch } from 'react-redux';

import { useSelector } from '#src-app/store';
import { fetchAllCredentials, fetchCollectionCredentials } from '#src-app/store/slices/Credentials/Credentials.thunks';
import { getLastParamOfUrl } from '#src-app/views/utils/routerUtils';

import CredentialsHeader from './Header';
import GridView from '../../GridView';
import { CredentialsTabs } from '../../Header';

const CredentialsList: VFC = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const isCollectionsTab = getLastParamOfUrl(router) === CredentialsTabs.COLLECTIONS;
    const credentials = useSelector(state => state.credentials.all);
    
    useEffect(() => {
        dispatch(fetchAllCredentials());
        dispatch(fetchCollectionCredentials('kolekcja_basi'));
    }, [dispatch]);

    return (
        <Box display="flex" flexDirection="column" gap="1.5rem">
            <CredentialsHeader/>
            <GridView credentials={credentials}/>
        </Box>
    );
};

export default CredentialsList;
