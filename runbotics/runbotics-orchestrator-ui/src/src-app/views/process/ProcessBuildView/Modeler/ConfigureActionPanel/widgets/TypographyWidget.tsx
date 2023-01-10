import React, { FC } from 'react';

import { InfoOutlined } from '@mui/icons-material';
import { Box, Typography, TypographyProps } from '@mui/material';
import { WidgetProps } from '@rjsf/core';

import If from '#src-app/components/utils/If';

interface TypographyWidgetProps extends WidgetProps {
    options: {
        text: string;
        variant: TypographyProps['variant'];
        infoIcon: boolean;
    }
}

const TypographyWidget: FC<TypographyWidgetProps> = ({ options }) => (
    <Box display="flex" gap="5px" alignItems="center">
        <If condition={options.infoIcon}>
            <InfoOutlined
                sx={{
                    color: (theme) => theme.palette.infoIcon.default
                }}
            />
        </If>
        <Typography variant={options.variant}>
            {options.text}
        </Typography>
    </Box>
);

export default TypographyWidget;
