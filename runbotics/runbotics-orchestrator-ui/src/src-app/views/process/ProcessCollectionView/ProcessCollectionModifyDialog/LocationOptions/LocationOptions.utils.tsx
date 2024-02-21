

// import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';

import TooltipIcon from '#src-app/components/TooltipIcon';
import { TootltipIcon as TootltipIconType} from '#src-app/components/TooltipIcon/TooltipIcon.types';

export const accessTooltipIcon: Record<string, TootltipIconType> = {
    public: <TooltipIcon translationKey='Process.Collection.Structure.Icon.Public.Tooltip' icon={PublicOutlinedIcon} />,
    specificUsers: <TooltipIcon translationKey='Process.Collection.Structure.Icon.Users.Tooltip' icon={PeopleAltOutlinedIcon} />,
    private: <TooltipIcon translationKey='Process.Collection.Structure.Icon.Private.Tooltip' icon={LockOutlinedIcon} />,
    home: <TooltipIcon translationKey='Process.Collection.Structure.Icon.Home.Tooltip' icon={HomeOutlinedIcon} />,
};

export const ABSTRACT_ROOT_COLLECTION_ID = 'root';
