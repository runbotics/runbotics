import { useEffect } from 'react';

import { useRouter } from 'next/router';

import CredentialTile from '#src-app/components/Tile/CredentialTile/CredentialTile';
import If from '#src-app/components/utils/If';
import { useDispatch, useSelector } from '#src-app/store';
import { credentialsActions } from '#src-app/store/slices/Credentials';
import { credentialTemplatesActions } from '#src-app/store/slices/CredentialTemplates';

import { TileGrid } from './GridView';
import CredentialsHeader from '../Credentials/CredentialsList/CredentialsHeader';

const CredentialsGridView = () => {
    const dispatch = useDispatch();
    const credentials = useSelector(state => state.credentials.all);
    const collections = useSelector(state => state.credentialCollections.credentialCollections);
    const loading = useSelector(state => state.credentials.loading);
    const credentialTemplates = useSelector(state => state.credentialTemplates.data);

    const router = useRouter();
    const collectionId = router.query.id ? (router.query.id as string) : null;

    useEffect(() => {
        dispatch(credentialTemplatesActions.fetchAllTemplates());
        collectionId
            ? dispatch(credentialsActions.fetchAllCredentialsInCollection({ resourceId: `${collectionId}/credentials/` }))
            : dispatch(credentialsActions.fetchAllCredentialsAccessibleInTenant());
    }, []);

    const credentialsTiles = credentials.map(credential => (
        <CredentialTile
            key={credential.id}
            credential={credential}
            collection={collections.find(collection => credential.collectionId === collection.id)}
            templateName={credentialTemplates.find(template => template.id === credential.templateId).name}
            collectionName={collections.find(collection => collection.id === credential.collectionId)?.name}
        />
    ));

    return (
        <>
            <CredentialsHeader credentialCount={credentials.length} />
            <If condition={!loading}>
                <TileGrid>{credentialsTiles}</TileGrid>
            </If>
        </>
    );
};

export default CredentialsGridView;
