import React from 'react';


import { useRouter } from 'next/router';
import styled from 'styled-components';

import If from '#src-app/components/utils/If';

import { getLastParamOfUrl } from '#src-app/views/utils/routerUtils';

import CredentialCollectionsGridView from './CredentialCollectionsGridView';
import CredentialsGridView from './CredentialsGridView';
import { CredentialsTabs } from '../Header';

export const TileGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    grid-auto-rows: 1fr;
    min-height: 8rem;
    gap: 1rem;
`;

const GridView = () => {
    const router = useRouter();
    const isCollectionsTab = getLastParamOfUrl(router) === CredentialsTabs.COLLECTIONS;

    return (
        <>
            <If condition={!isCollectionsTab}>
                <CredentialsGridView />
            </If>
            <If condition={isCollectionsTab}>
                <CredentialCollectionsGridView />
            </If>
        </>
    );
};

export default GridView;
