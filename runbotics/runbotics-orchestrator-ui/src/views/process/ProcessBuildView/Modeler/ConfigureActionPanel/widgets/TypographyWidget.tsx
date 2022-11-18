import React, { FC } from 'react';
import { Box, Typography, TypographyTypeMap } from '@mui/material';
import { WidgetProps } from '@rjsf/core';
import InfoIcon from '@mui/icons-material/Info';
import If from 'src/components/utils/If';

interface TypographyWidgetProps extends WidgetProps {
    options: {
        text: string;
        variant: TypographyTypeMap['props']['variant'];
        infoIcon: boolean;
    }
}

const TypographyWidget: FC<TypographyWidgetProps> = ({ options }) => (
    <Box display="flex" gap="5px">
        <If condition={options.infoIcon}>
            <InfoIcon
                sx={{
                    color: (theme) => theme.palette.secondary.main,
                }}
            />
        </If>
        <Typography variant={options.variant}>
            {options.text}
        </Typography>
    </Box>
);

export default TypographyWidget;
