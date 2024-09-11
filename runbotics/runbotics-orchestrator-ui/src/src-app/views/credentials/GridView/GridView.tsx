import { useRouter } from 'next/router';

import If from '#src-app/components/utils/If';

import { getLastParamOfUrl } from '#src-app/views/utils/routerUtils';

import CredentialCollectionsGridView from './CredentialCollectionsGridView';
import CredentialsGridView from './CredentialsGridView';
import { CredentialsTabs } from '../Header';



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
