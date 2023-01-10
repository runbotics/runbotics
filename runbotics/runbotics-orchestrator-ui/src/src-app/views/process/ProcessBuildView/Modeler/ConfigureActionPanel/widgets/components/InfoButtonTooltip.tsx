import { FC } from 'react';

import { InfoOutlined } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import { sanitize } from 'dompurify';

interface InfoButtonTooltipProps {
    message: string;
}

const InfoButtonTooltip: FC<InfoButtonTooltipProps> = ({
    message
}) => (
    <Tooltip title={<span dangerouslySetInnerHTML={{__html: sanitize(message) }}></span>}>
        <span>
            <IconButton>
                <InfoOutlined/>
            </IconButton>
        </span>
    </Tooltip>
);

export default InfoButtonTooltip;
