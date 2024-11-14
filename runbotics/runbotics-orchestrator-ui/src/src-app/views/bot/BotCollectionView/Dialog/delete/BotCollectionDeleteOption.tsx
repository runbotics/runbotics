import React, { FC, useState } from 'react';

import { MenuItem } from '@mui/material';
import { BotCollectionDto } from 'runbotics-common';


import useTranslations from '#src-app/hooks/useTranslations';

import BotCollectionDeleteDialog from './BotCollectionDeleteDialog';
import { CollectionsDisplayMode } from '../../../BotBrowseView/BotBrowseView.utils';
import { getLimitByDisplayMode, getBotCollectionPageParams } from '../../BotCollectionView.utils';


interface DeleteBotCollectionProps {
    botCollection: BotCollectionDto;
    displayMode: CollectionsDisplayMode;
}

const BotCollectionDeleteOption: FC<DeleteBotCollectionProps> = ({ botCollection, displayMode }) => {
    const [show, setShow] = useState(false);
    const { translate } = useTranslations();

    const handleDelete = () => {
        setShow(false);
    };

    const params = getBotCollectionPageParams(0, getLimitByDisplayMode(displayMode));

    return (
        <>
            <MenuItem onClick={() => setShow(true)}>{translate('Bot.Collection.Actions.Delete')}</MenuItem>
            <BotCollectionDeleteDialog
                botCollection={botCollection}
                open={show}
                onClose={() => setShow(false)}
                onDelete={handleDelete}
                pageParams={params}
            />
        </>
    );
};

export default BotCollectionDeleteOption;
