import React from 'react';

import Add from '@mui/icons-material/Add';
import ArrowDownward from '@mui/icons-material/ArrowDownward';
import ArrowUpward from '@mui/icons-material/ArrowUpward';
import Remove from '@mui/icons-material/Remove';
import { ButtonProps, Button } from '@mui/material';

const mappings = {
    remove: Remove,
    plus: Add,
    'arrow-up': ArrowUpward,
    'arrow-down': ArrowDownward,
};

type IconButtonProps = ButtonProps & {
    icon: string;
    iconProps?: Record<string, unknown>;
};

const IconButton = (props: IconButtonProps) => {
    const { icon, iconProps, ...otherProps } = props;
    const IconComp = mappings[icon];
    return (
        <Button {...otherProps} size="small">
            <IconComp {...iconProps} />
        </Button>
    );
};

export default IconButton;
