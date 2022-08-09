import { IconButton, Menu } from '@mui/material';
import React, { VFC } from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { FeatureKey, IBot } from 'runbotics-common';
import useFeatureKey from 'src/hooks/useFeatureKey';
import If from 'src/components/utils/If';
import ActionBotButtonDelete from './ActionBotButton.delete';

const ActionBotButton: VFC<{ bot: IBot }> = ({ bot }) => {
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement>(null);
    const { id, installationId: name } = bot;
    const hasAccessToDeleteBot = useFeatureKey([FeatureKey.BOT_DELETE]);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <IconButton aria-label="settings" onClick={handleClick}>
                <MoreVertIcon />
            </IconButton>
            <Menu id="bot-collection-tile-menu" anchorEl={anchorEl} keepMounted open={!!anchorEl} onClose={handleClose}>
                <If condition={hasAccessToDeleteBot}>
                    <ActionBotButtonDelete name={name} id={id} />
                </If>
            </Menu>
        </>
    );
};

export default ActionBotButton;
