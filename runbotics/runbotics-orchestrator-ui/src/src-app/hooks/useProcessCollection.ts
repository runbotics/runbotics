import { useSearchParams } from 'next/navigation';
import { COLLECTION_ID_PARAM, IUser, ProcessCollection } from 'runbotics-common';

import { useSelector } from '#src-app/store';
import { ROOT_PROCESS_COLLECTION_ID } from '#src-app/views/process/ProcessCollectionView/ProcessCollection.utils';
import { accessTooltipIcon } from '#src-app/views/process/ProcessCollectionView/ProcessCollectionModifyDialog/LocationOptions/LocationOptions.utils';

type ProcessCollectionHierarchy = ProcessCollection & { children?: ProcessCollectionHierarchy[] };
interface GetIconParams {
    isPublic: boolean,
    users: IUser[]
}

const getIcon = ({ isPublic, users }: GetIconParams ) => {
    if (isPublic) {
        return accessTooltipIcon.public;
    }
    if (users.length > 0) {
        return accessTooltipIcon.specificUsers;
    }
    return accessTooltipIcon.private;
};

const getHierarchicalStructure = (parentNode: ProcessCollectionHierarchy, allNodes: ProcessCollection[]) => {
    const nodeChildren = allNodes.filter((node: any) => node.parentId === parentNode.id);
    const parentNodeWithIcon = {
        ...parentNode,
        icon: getIcon({ isPublic: parentNode.isPublic, users: parentNode.users }),
    };

    return nodeChildren.length > 0
        ? {
            ...parentNodeWithIcon,
            children: nodeChildren.map((child: any) => getHierarchicalStructure(child, allNodes))
        }
        : parentNodeWithIcon;
};

const useProcessCollection = () => {
    const collectionId = useSearchParams().get(COLLECTION_ID_PARAM) ?? ROOT_PROCESS_COLLECTION_ID;
    const { allUserAccessible: { list: userAccessible } } = useSelector(state => state.processCollection);
    const rootCollections = userAccessible.filter(collection => collection.parentId === null);
    const userAccessibleHierarchy = rootCollections.map((node: any) => getHierarchicalStructure(node, userAccessible));

    return ({
        currentCollectionId: collectionId,
        userAccessibleHierarchy,
    });
};

export default useProcessCollection;
