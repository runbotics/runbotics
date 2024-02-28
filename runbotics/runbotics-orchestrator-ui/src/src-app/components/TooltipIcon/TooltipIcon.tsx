import { FC } from 'react';

import { Tooltip } from '@mui/material';

import useTranslations from '#src-app/hooks/useTranslations';

import { TooltipIconProps } from './TooltipIcon.types';
import { checkTranslationKey } from '../../views/process/ProcessCollectionView/ProcessCollection.utils';

export const tooltipOptionsWithoutOffset = {
    popper: {
        modifiers: [
            {
                name: 'offset',
                options: {
                    offset: [0, -14],
                },
            },
        ],
    },
};

const TooltipIcon: FC<TooltipIconProps> = ({ translationKey, icon: Icon }) => {
    const { translate } = useTranslations();
    const title = checkTranslationKey(translationKey) ? translate(translationKey) : null;

    return (
        <Tooltip
            title={title}
            slotProps={tooltipOptionsWithoutOffset}
        >
            <Icon
                sx={{ p: 0.25 }}
            />
        </Tooltip>
    );
};

export default TooltipIcon;
