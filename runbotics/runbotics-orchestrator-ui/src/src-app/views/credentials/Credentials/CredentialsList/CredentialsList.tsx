import { VFC, useEffect } from 'react';

import { Box } from '@mui/material';
import { useRouter } from 'next/router';

import { useDispatch } from 'react-redux';

import { useSelector } from '#src-app/store';
import { fetchAllCredentialsAccessibleInTenant } from '#src-app/store/slices/Credentials/Credentials.thunks';
import { getLastParamOfUrl } from '#src-app/views/utils/routerUtils';

import CredentialsHeader from './CredentialsHeader';
import GridView from '../../GridView';
import { CredentialsTabs } from '../../Header';

const CredentialsList: VFC = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const isCollectionsTab = getLastParamOfUrl(router) === CredentialsTabs.COLLECTIONS;
    const credentials = useSelector(state => state.credentials.all);
    
    useEffect(() => {
        dispatch(fetchAllCredentialsAccessibleInTenant());
    }, [dispatch]);

    return (
        <Box display="flex" flexDirection="column" gap="1.5rem">
            <CredentialsHeader credentialCount={credentials.length}/>
            <GridView credentials={credentials}/>
        </Box>
    );
};

export default CredentialsList;
