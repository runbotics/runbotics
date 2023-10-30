import React, { FC, useState } from 'react';

import { MenuItem } from '@mui/material';


import useTranslations from '#src-app/hooks/useTranslations';

import { BotCollectionModifyProps } from './BotCollectionModify.types';
import BotCollectionModifyDialog from './BotCollectionModifyDialog';
import { getBotCollectionPageParams, getLimitByDisplayMode } from '../../BotCollectionView.utils';


const BotCollectionModifyOption: FC<BotCollectionModifyProps> = ({ botCollection, displayMode }) => {
    const [show, setShow] = useState(false);
    const params = getBotCollectionPageParams(0, getLimitByDisplayMode(displayMode));
    const { translate } = useTranslations();

    return (
        <>
            <MenuItem onClick={() => setShow(true)}>{translate('Bot.Collection.Actions.Modify')}</MenuItem>
            <BotCollectionModifyDialog
                open={show}
                onClose={() => setShow(false)}
                pageParams={params}
                collection={botCollection}
            />
        </>
    );
};

export default BotCollectionModifyOption;
