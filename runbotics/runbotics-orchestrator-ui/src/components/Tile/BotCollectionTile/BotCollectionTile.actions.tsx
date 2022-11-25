import React, { VFC } from 'react';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconButton, Menu } from '@mui/material';
import { FeatureKey } from 'runbotics-common';

import If from 'src/components/utils/If';
import useFeatureKey from 'src/hooks/useFeatureKey';
import useTranslations from 'src/hooks/useTranslations';
import BotCollectionDeleteOption from 'src/views/bot/BotCollectionView/Dialog/delete/BotCollectionDeleteOption';
import BotCollectionIdentifierOption from
    'src/views/bot/BotCollectionView/Dialog/identifier/BotCollectionIdentifierOption';
import BotCollectionModifyOption from 'src/views/bot/BotCollectionView/Dialog/modify/BotCollectionModifyOption';

import { BotCollectionTileProps } from './BotCollectionTile.types';

const BotCollectionTileAction: VFC<BotCollectionTileProps> = ({ botCollection, displayMode }) => {
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement>(null);
    const { translate } = useTranslations();
    const hasDeleteBotCollectionAccess = useFeatureKey([FeatureKey.BOT_COLLECTION_DELETE]);
    const hasEditBotCollectionAccess = useFeatureKey([FeatureKey.BOT_COLLECTION_EDIT]);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <IconButton aria-label={translate('Component.Tile.BotCollection.Settings.AriaLabel')} onClick={handleClick}>
                <MoreVertIcon />
            </IconButton>
            <Menu id="bot-collection-tile-menu" anchorEl={anchorEl} keepMounted open={!!anchorEl} onClose={handleClose}>
                <BotCollectionIdentifierOption botCollection={botCollection} />
                <If condition={hasDeleteBotCollectionAccess}>
                    <BotCollectionDeleteOption botCollection={botCollection} displayMode={displayMode} />
                </If>
                <If condition={hasEditBotCollectionAccess}>
                    <BotCollectionModifyOption botCollection={botCollection} displayMode={displayMode} />
                </If>
            </Menu>
        </>
    );
};

export default BotCollectionTileAction;
