import { VFC } from 'react';

import { Box } from '@mui/material';
import { useRouter } from 'next/router';

import { getLastParamOfUrl } from '#src-app/views/utils/routerUtils';

import CredentialsHeader from './Header';
import GridView from '../../GridView';
import { CredentialsTabs } from '../../Header';

const CredentialsList: VFC = () => {
    const router = useRouter();
    const isCollectionsTab = getLastParamOfUrl(router) === CredentialsTabs.COLLECTIONS;

    return (
        <Box display="flex" flexDirection="column" gap="1.5rem">
            <CredentialsHeader/>
            <GridView/>
        </Box>
    );
};

export default CredentialsList;
