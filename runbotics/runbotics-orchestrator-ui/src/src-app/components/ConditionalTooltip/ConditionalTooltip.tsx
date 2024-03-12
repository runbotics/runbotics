import { FC } from 'react';

import { Tooltip } from '@mui/material';

import { ConditionalTooltipProps } from './ConditionalTooltip.types';
import If from '../utils/If';

const ConditionalTooltip: FC<ConditionalTooltipProps> = ({ display, title, children }) => (
    <If condition={display} else={children}>
        <Tooltip title={title}>
            <div>{children}</div>
        </Tooltip>
    </If>
);

export default ConditionalTooltip;

