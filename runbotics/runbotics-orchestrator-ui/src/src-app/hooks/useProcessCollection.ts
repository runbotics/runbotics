import { useEffect } from 'react';

import { useSearchParams } from 'next/navigation';
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
    const dispatch = useDispatch();
    const collectionId: string = useSearchParams().get(COLLECTION_ID_PARAM) ?? ROOT_PROCESS_COLLECTION_ID;
    const { pathCollections } = useSelector(processCollectionSelector);
    const breadcrumbs = getBreadcrumbs(pathCollections);
    const isOwner = getCollectionOwner(collectionId);

    const getCollectionPath = () => {
        dispatch(processCollectionActions.getPath(collectionId));
    };

    useEffect(() => {
        getCollectionPath();
    }, [collectionId]);

    return ({
        currentCollectionId: collectionId,
        breadcrumbs,
        isOwner
    });
};

export default useProcessCollection;
