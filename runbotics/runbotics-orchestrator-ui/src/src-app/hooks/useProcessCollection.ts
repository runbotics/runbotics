import { useEffect } from 'react';

import { useSearchParams } from 'next/navigation';
import { useSnackbar } from 'notistack';
import { COLLECTION_ID_PARAM, CollectionId, ProcessCollection } from 'runbotics-common';

import { useDispatch, useSelector } from '#src-app/store';
import { processCollectionActions, processCollectionSelector } from '#src-app/store/slices/ProcessCollection';
import { ROOT_PROCESS_COLLECTION_ID } from '#src-app/views/process/ProcessCollectionView/ProcessCollection.utils';

import useTranslations from './useTranslations';

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
    const { translate } = useTranslations();
    const { enqueueSnackbar } = useSnackbar();
    const collectionId: string = useSearchParams().get(COLLECTION_ID_PARAM) ?? ROOT_PROCESS_COLLECTION_ID;
    const { active: { ancestors: { list: collectionAncestors } } } = useSelector(processCollectionSelector);
    const breadcrumbs = getBreadcrumbs(collectionAncestors);
    const isOwner = getCollectionOwner(collectionId);

    const getCollectionPath = () => {
        dispatch(processCollectionActions.getAncestors(collectionId)).unwrap()
            .catch(() => {
                enqueueSnackbar(
                    translate('Process.Collection.Ancestors.Error'),
                    { variant: 'error'}
                );
            });
    };

    const getAllChildrenCollections = (colId) => {
        const params = colId !== null ? {
            filter: { equals: { parentId: colId } }
        } : {};
        return dispatch(processCollectionActions.getAll(params));
    };

    useEffect(() => {
        getAllChildrenCollections(collectionId)
            .unwrap()
            .then(() => {
                getCollectionPath();
            })
            .catch(() => {});
    }, [collectionId]);

    return ({
        currentCollectionId: collectionId,
        breadcrumbs,
        isOwner
    });
};

export default useProcessCollection;
