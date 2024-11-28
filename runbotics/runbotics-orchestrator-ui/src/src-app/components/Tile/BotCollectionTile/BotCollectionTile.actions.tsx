import React, { VFC } from 'react';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { FeatureKey, DefaultCollections } from 'runbotics-common';

import If from '#src-app/components/utils/If';
import useFeatureKey from '#src-app/hooks/useFeatureKey';
import useTranslations from '#src-app/hooks/useTranslations';
import BotCollectionDeleteOption from '#src-app/views/bot/BotCollectionView/Dialog/delete/BotCollectionDeleteOption';
import BotCollectionIdentifierOption from '#src-app/views/bot/BotCollectionView/Dialog/identifier/BotCollectionIdentifierOption';

import { BotCollectionTileProps } from './BotCollectionTile.types';

const publicAndGuestCollection = [
    DefaultCollections.GUEST,
    DefaultCollections.PUBLIC,
];

const BotCollectionTileAction: VFC<BotCollectionTileProps> = ({
    botCollection,
    displayMode,
    handleEdit
}) => {
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement>(null);
    const { translate } = useTranslations();
    const hasDeleteBotCollectionAccess = useFeatureKey([
        FeatureKey.BOT_COLLECTION_DELETE,
    ]);
    const hasEditBotCollectionAccess = useFeatureKey([
        FeatureKey.BOT_COLLECTION_EDIT,
    ]);

    const isDeleteAndModifyVisible = !publicAndGuestCollection.includes(
        DefaultCollections[botCollection.name]
    );

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <IconButton
                aria-label={translate(
                    'Component.Tile.BotCollection.Settings.AriaLabel'
                )}
                onClick={handleClick}
            >
                <MoreVertIcon />
            </IconButton>
            <Menu
                id="bot-collection-tile-menu"
                anchorEl={anchorEl}
                keepMounted
                open={!!anchorEl}
                onClose={handleClose}
            >
                <BotCollectionIdentifierOption botCollection={botCollection} />
                <If
                    condition={
                        hasDeleteBotCollectionAccess && isDeleteAndModifyVisible
                    }
                >
                    <BotCollectionDeleteOption
                        botCollection={botCollection}
                        displayMode={displayMode}
                    />
                </If>
                <If
                    condition={
                        hasEditBotCollectionAccess && isDeleteAndModifyVisible
                    }
                >
                    <MenuItem
                        onClick={() => {
                            handleEdit(botCollection.id);
                        }}
                    >
                        {translate('Bot.Collection.Actions.Modify')}
                    </MenuItem>
                </If>
            </Menu>
        </>
    );
};

export default BotCollectionTileAction;
