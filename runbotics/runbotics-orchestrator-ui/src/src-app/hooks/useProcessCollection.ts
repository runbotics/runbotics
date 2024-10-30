import { useEffect } from 'react';

import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { COLLECTION_ID_PARAM, ProcessCollection, ROOT_PROCESS_COLLECTION_ID } from 'runbotics-common';

import { useDispatch, useSelector } from '#src-app/store';
import { processCollectionActions, processCollectionSelector } from '#src-app/store/slices/ProcessCollection';

export interface CollectionBreadcrumb {
    name: string;
    collectionId: string;
}

interface UseProcessCollectionOutput {
    currentCollectionId: string;
    breadcrumbs: CollectionBreadcrumb[];
    currentCollection: ProcessCollection | null;
}

export const getBreadcrumbs = (pathCollections: ProcessCollection[]): CollectionBreadcrumb[] =>
    pathCollections.map((collection) => ({
        name: collection.name,
        collectionId: collection.id
    }));

const useProcessCollection = (): UseProcessCollectionOutput => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { active: { ancestors: collectionAncestors } } = useSelector(processCollectionSelector);
    const breadcrumbs = getBreadcrumbs(collectionAncestors);
    const collectionId: string = useSearchParams().get(COLLECTION_ID_PARAM) ?? ROOT_PROCESS_COLLECTION_ID;

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [collectionId]);

    return ({
        currentCollectionId: collectionId,
        currentCollection: collectionAncestors.at(-1) ?? null,
        breadcrumbs,
    });
};

export default useProcessCollection;
