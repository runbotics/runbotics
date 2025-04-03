import React, { FC } from 'react';

import { MenuItem, Select } from '@mui/material';

import { OfferAdditionalParameterOption } from '#contentful/common';

interface Props {
    selectedOption: OfferAdditionalParameterOption;
    options: OfferAdditionalParameterOption[];
    onChange: (newValue: string) => void;
}

export const ParameterSelect: FC<Props> = ({ selectedOption, options, onChange }) => (
    <Select<string>
        onChange={(e) => {
            onChange(e.target.value);
        }}
        value={selectedOption.name}
        sx={{
            width: '60%'
        }}>
        {options.map(option => (
            <MenuItem key={option.name} value={option.name}>{option.name}</MenuItem>
        ))}
    </Select>
);
