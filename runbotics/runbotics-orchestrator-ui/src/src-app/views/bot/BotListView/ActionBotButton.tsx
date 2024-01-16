import React, { VFC } from 'react';

// import MoreVertIcon from '@mui/icons-material/MoreVert';
// import { IconButton, Menu } from '@mui/material';
// import { FeatureKey, IBot } from 'runbotics-common';


// import If from '#src-app/components/utils/If';
// import useFeatureKey from '#src-app/hooks/useFeatureKey';

// import ActionBotButtonDelete from './ActionBotButton.delete';


// const ActionBotButton: VFC<{ bot: IBot }> = ({ bot }) => {
//     const [anchorEl, setAnchorEl] = React.useState<HTMLElement>(null);
//     const { id, installationId: name } = bot;
//     const hasDeleteBotAccess = useFeatureKey([FeatureKey.BOT_DELETE]);

//     const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
//         setAnchorEl(event.currentTarget);
//     };

//     const handleClose = () => {
//         setAnchorEl(null);
//     };

//     return (
//         <>
//             <IconButton aria-label="settings" onClick={handleClick}>
//                 <MoreVertIcon />
//             </IconButton>
//             <Menu id="bot-collection-tile-menu" anchorEl={anchorEl} open={!!anchorEl} onClose={handleClose}>
//                 <If condition={hasDeleteBotAccess}>
//                     <ActionBotButtonDelete name={name} id={id} />
//                 </If>
//             </Menu>
//         </>
//     );
// };

// export default ActionBotButton;
