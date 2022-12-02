import React, { VFC } from 'react';

import Toc from '@mui/icons-material/Toc';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import {
    Box, TextField, ToggleButton, ToggleButtonGroup, Typography,
} from '@mui/material';

import { FeatureKey } from 'runbotics-common';


import If from '#src-app/components/utils/If';

import useFeatureKey from '#src-app/hooks/useFeatureKey';

import useTranslations from '#src-app/hooks/useTranslations';

import { CollectionsDisplayMode } from '../../BotBrowseView/BotBrowseView.utils';
import { classes } from '../BotCollectionView.styles';
import { BotCollectionHeaderProps } from '../BotCollectionView.types';
import BotCollectionCreateButton from '../Dialog/modify/BotCollectionCreateButton';


const BotCollectionHeader: VFC<BotCollectionHeaderProps> = ({
    displayMode, onDisplayModeChange, botCollectionLength, search, onSearchChange,
}) => {
    const { translate } = useTranslations();
    const hasAddNewBotCollectionAccess = useFeatureKey([FeatureKey.BOT_COLLECTION_ADD]);

    return (
        <Box display="flex" flexDirection="column" gap="1rem">
            <Box display="flex" justifyContent="flex-end">
                <If condition={hasAddNewBotCollectionAccess}>
                    <BotCollectionCreateButton
                        displayMode={displayMode}
                    />
                </If>
            </Box>
            <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography className={classes.title} variant="h5" color="textPrimary">
                    {translate('Bot.Collection.Header.ShowingAmountOfCollections', { count: botCollectionLength })}
                </Typography>
                <Box display="flex" alignItems="center" flexGrow="1" justifyContent="flex-end" gap="1rem">
                    <If condition={displayMode === CollectionsDisplayMode.GRID}>
                        <TextField
                            id="outlined-search"
                            label={translate('Bot.Collection.Header.Search.Label')}
                            onChange={onSearchChange}
                            value={search}
                            size="small"
                            sx={{ width: '30%' }}
                        />
                    </If>
                    <ToggleButtonGroup exclusive onChange={onDisplayModeChange} size="small" value={displayMode}>
                        <ToggleButton value={CollectionsDisplayMode.GRID}>
                            <ViewModuleIcon />
                        </ToggleButton>
                        <ToggleButton value={CollectionsDisplayMode.LIST}>
                            <Toc />
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Box>
            </Box>
        </Box>
    );
};

export default BotCollectionHeader;
