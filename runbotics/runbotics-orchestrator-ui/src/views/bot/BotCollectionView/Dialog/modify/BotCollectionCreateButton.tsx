import React, { FC, useState } from 'react';
import { Button, SvgIcon } from '@mui/material';
import { PlusCircle as PlusIcon } from 'react-feather';
import useTranslations from 'src/hooks/useTranslations';
import BotCollectionModifyDialog from './BotCollectionModifyDialog';
import { BotCollectionModifyProps } from './BotCollectionModify.types';
import { getBotCollectionPageParams, getLimitByDisplayMode } from '../../BotCollectionView.utils';

const BotCollectionCreateButton: FC<BotCollectionModifyProps> = ({ botCollection, displayMode }) => {
    const [show, setShow] = useState(false);
    const params = getBotCollectionPageParams(0, getLimitByDisplayMode(displayMode));
    const { translate } = useTranslations();

    return (
        <>
            <Button
                color="primary"
                variant="contained"
                onClick={() => setShow(true)}
                startIcon={(
                    <SvgIcon fontSize="small">
                        <PlusIcon />
                    </SvgIcon>
                )}
            >
                {translate('Bot.Collection.Dialog.Modify.CreateButton')}
            </Button>
            <BotCollectionModifyDialog
                open={show}
                onClose={() => setShow(false)}
                pageParams={params}
                collection={botCollection}
            />
        </>
    );
};

export default BotCollectionCreateButton;
