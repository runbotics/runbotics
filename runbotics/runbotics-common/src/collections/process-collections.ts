import { ProcessCollection } from "../model";

export const COLLECTION_ID_PARAM = 'collectionId';

export type ProcessCollectionKeys = { [Key in keyof ProcessCollection]: Key }[keyof ProcessCollection];

export type ProcessCollectionValues = ProcessCollection[ProcessCollectionKeys];