import { useEffect } from 'react';

import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { COLLECTION_ID_PARAM, CollectionId, ProcessCollection } from 'runbotics-common';

import { useDispatch, useSelector } from '#src-app/store';
import { processCollectionActions, processCollectionSelector } from '#src-app/store/slices/ProcessCollection';
import { ROOT_PROCESS_COLLECTION_ID } from '#src-app/views/process/ProcessCollectionView/ProcessCollection.utils';


export interface CollectionBreadcrumb {
    name: string;
    collectionId: string;
}

const getBreadcrumbs = (pathCollections: ProcessCollection[]): CollectionBreadcrumb[] =>
    pathCollections.map((collection) => ({
        name: collection.name,
        collectionId: collection.id
    }));

const getCollectionOwner = (collectionId: CollectionId) => true; // todo

const useProcessCollection = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const collectionId: string = useSearchParams().get(COLLECTION_ID_PARAM) ?? ROOT_PROCESS_COLLECTION_ID;
    const { active: { ancestors: collectionAncestors } } = useSelector(processCollectionSelector);
    const breadcrumbs = getBreadcrumbs(collectionAncestors);
    const isOwner = getCollectionOwner(collectionId);

    const getAllCollections = (colId) => {
        const params = colId !== null ? {
            filter: { equals: { parentId: colId } }
        } : {};
        return dispatch(processCollectionActions.getAllWithAncestors(params));
    };

    useEffect(() => {
        getAllCollections(collectionId)
            .unwrap()
            .catch(() => {
                router.replace('/404');
            });
    }, [collectionId]);

    return ({
        currentCollectionId: collectionId,
        breadcrumbs,
        isOwner
    });
};

export default useProcessCollection;
