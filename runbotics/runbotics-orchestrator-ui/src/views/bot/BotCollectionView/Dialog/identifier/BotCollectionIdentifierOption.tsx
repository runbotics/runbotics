import React, { useState } from 'react';

import { MenuItem } from '@mui/material';
import { IBotCollection } from 'runbotics-common';

import useTranslations from 'src/hooks/useTranslations';

import BotCollectionIdentifierDialog from './BotCollectionIdentifierDialog';

type IdentifierBotCollectionProps = {
    botCollection: IBotCollection;
};

const BotCollectionIdentifierOption = (props: IdentifierBotCollectionProps) => {
    const [show, setShow] = useState(false);
    const { translate } = useTranslations();

    return (
        <>
            <MenuItem onClick={() => setShow(true)}>{translate('Bot.Collection.Actions.Identifier')}</MenuItem>
            <BotCollectionIdentifierDialog
                botCollection={props.botCollection}
                open={show}
                onClose={() => setShow(false)}
            />
        </>
    );
};

export default BotCollectionIdentifierOption;
