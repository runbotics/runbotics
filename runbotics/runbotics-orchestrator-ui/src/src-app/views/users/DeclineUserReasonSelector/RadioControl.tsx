import React from 'react';

import { FormControlLabel, Radio } from '@mui/material';

interface RadioControlProps {
    label: string;
    value: unknown;
}

const radioStyle = {
    color: 'black',
    '&.Mui-root': {
        color: 'black',
    },
};

export const RadioControl = ({ label, value }: RadioControlProps) => (
    <FormControlLabel
        value={value}
        control={<Radio sx={radioStyle} />}
        label={label}
    />
);
