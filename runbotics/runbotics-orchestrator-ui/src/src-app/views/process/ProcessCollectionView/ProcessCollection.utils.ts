import moment from 'moment';
import { IUser, ProcessCollection } from 'runbotics-common';

import processCollectionTranslations from '#src-app/translations/en/collections';

export const ROOT_PROCESS_COLLECTION_ID = null;

const INITIAL_VALUES: ProcessCollection = {
    id: null,
    name: '',
    description: '',
    isPublic: false,
    users: [],
    parentId: ROOT_PROCESS_COLLECTION_ID,
};

export const prepareIncompleteCollectionEntity = (
    createdBy: IUser,
    collection?: ProcessCollection,
): ProcessCollection => ({
    id: collection ? collection.id : INITIAL_VALUES.id,
    parentId: collection ? collection.parentId : INITIAL_VALUES.parentId,
    name: collection ? collection.name : INITIAL_VALUES.name,
    description: collection ? collection.description : INITIAL_VALUES.description,
    isPublic: collection ? collection.isPublic : INITIAL_VALUES.isPublic,
    users: collection ? collection.users : INITIAL_VALUES.users,
    createdBy: collection ? collection.createdBy : createdBy,
});

export const completeCollectionEntity = (incompleteCollection: ProcessCollection): ProcessCollection => ({
    ...incompleteCollection,
    created: incompleteCollection?.created ? incompleteCollection.created : moment().toISOString(),
    updated: moment().toISOString(),
});

export const checkTranslationKey = (key: string): key is keyof typeof processCollectionTranslations => processCollectionTranslations.hasOwnProperty(key);
