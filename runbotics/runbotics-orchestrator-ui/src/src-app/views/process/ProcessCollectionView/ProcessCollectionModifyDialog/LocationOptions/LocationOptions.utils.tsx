import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import { ProcessCollection } from 'runbotics-common';

import TooltipIcon from '#src-app/components/TooltipIcon';
import { TootltipIcon as TootltipIconType} from '#src-app/components/TooltipIcon/TooltipIcon.types';

import { GetIconParams, ProcessCollectionHierarchy } from './LocationOptions.types';

export const accessTooltipIcon: Record<string, TootltipIconType> = {
    public: <TooltipIcon translationKey='Process.Collection.Structure.Icon.Public.Tooltip' icon={PublicOutlinedIcon} />,
    specificUsers: <TooltipIcon translationKey='Process.Collection.Structure.Icon.Users.Tooltip' icon={PeopleAltOutlinedIcon} />,
    private: <TooltipIcon translationKey='Process.Collection.Structure.Icon.Private.Tooltip' icon={LockOutlinedIcon} />,
    home: <TooltipIcon translationKey='Process.Collection.Structure.Icon.Home.Tooltip' icon={HomeOutlinedIcon} />,
};

export const ABSTRACT_ROOT_COLLECTION_ID = 'root';

export const getIcon = ({ isPublic, users }: GetIconParams) => {
    if (isPublic) {
        return accessTooltipIcon.public;
    }
    if (users.length > 0) {
        return accessTooltipIcon.specificUsers;
    }
    return accessTooltipIcon.private;
};

export const getHierarchicalStructure = (parentNode: ProcessCollectionHierarchy, allNodes: ProcessCollection[]) => {
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
