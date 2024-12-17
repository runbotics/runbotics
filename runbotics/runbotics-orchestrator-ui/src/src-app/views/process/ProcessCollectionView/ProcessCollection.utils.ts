import moment from 'moment';
import { CollectionId, ProcessCollection, ROOT_PROCESS_COLLECTION_ID, BasicUserDto } from 'runbotics-common';

import processCollectionTranslations from '#src-app/translations/en/collections';

const INITIAL_VALUES: ProcessCollection = {
    id: null,
    name: '',
    description: '',
    isPublic: false,
    users: [],
    parentId: ROOT_PROCESS_COLLECTION_ID,
};

export const prepareIncompleteCollectionEntity = (
    createdBy: BasicUserDto,
    currentCollectionId: CollectionId,
    collection?: ProcessCollection,
): ProcessCollection => ({
    id: collection ? collection.id : INITIAL_VALUES.id,
    parentId: collection?.parentId || currentCollectionId || INITIAL_VALUES.parentId,
    name: collection ? collection.name : INITIAL_VALUES.name,
    description: collection ? collection.description : INITIAL_VALUES.description,
    isPublic: collection ? collection.isPublic : INITIAL_VALUES.isPublic,
    users: collection ? collection.users : INITIAL_VALUES.users,
    createdBy: collection ? collection.createdBy : createdBy,
    created: collection ? collection.created : null,
});

export const completeCollectionEntity = (incompleteCollection: ProcessCollection): ProcessCollection => ({
    ...incompleteCollection,
    created: incompleteCollection?.created ? incompleteCollection.created : moment().toISOString(),
    updated: moment().toISOString(),
});

export const checkTranslationKey = (key: string): key is keyof typeof processCollectionTranslations => processCollectionTranslations.hasOwnProperty(key);
