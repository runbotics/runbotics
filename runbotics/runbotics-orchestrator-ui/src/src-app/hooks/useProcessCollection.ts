import { useSearchParams } from 'next/navigation';
import { COLLECTION_ID_PARAM, CollectionId } from 'runbotics-common';

import { ROOT_PROCESS_COLLECTION_ID } from '#src-app/views/process/ProcessCollectionView/ProcessCollection.utils';

const getCollectionOwner = (collectionId: CollectionId) => true; // todo

const useProcessCollection = () => {
    const collectionId = useSearchParams().get(COLLECTION_ID_PARAM) ?? ROOT_PROCESS_COLLECTION_ID;
    // const breadcrumbs = getBreadcrumbs(collectionId); // todo
    const isOwner = getCollectionOwner(collectionId);

    return ({
        currentCollectionId: collectionId,
        // breadcrumbs, // todo
        isOwner
    });
};

export default useProcessCollection;
