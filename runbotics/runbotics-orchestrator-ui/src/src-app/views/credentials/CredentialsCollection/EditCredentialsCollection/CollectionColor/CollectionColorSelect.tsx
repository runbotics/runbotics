import { useState } from 'react';

import { FormControl, InputLabel, MenuItem, Typography } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import { ColorDot } from './CollectionColor.styled';
import { CollectionColorName, collectionColors, getColorNameByHex } from './CollectionColor.types';

const CollectionColorSelect = ({ currentColor, credentialsCollectionData, setCredentialCollectionColor }) => {
    const [collectionColor, setCollectionColor] = useState(
        currentColor ? collectionColors[currentColor].hex : collectionColors.DARK_ORANGE.hex
    );

    const handleChange = (event: SelectChangeEvent) => {
        setCollectionColor(event.target.value);
        const colorName = getColorNameByHex(event.target.value);
        setCredentialCollectionColor({ ...credentialsCollectionData, color: colorName });
    };

    const colorsToChoose = Object.keys(collectionColors).map((colorName: CollectionColorName) => (
        <MenuItem key={collectionColors[colorName].hex} value={collectionColors[colorName].hex}>
            <ColorDot collectionColor={collectionColors[colorName].hex} />
            <Typography>{collectionColors[colorName].name}</Typography>
        </MenuItem>
    ));

    return (
        <FormControl fullWidth>
            <InputLabel id="collection_color">Collection color</InputLabel>
            <Select
                SelectDisplayProps={{ style: { display: 'flex' } }}
                labelId="collection_color-label"
                id="collection_color-select"
                value={collectionColor}
                label="Collection color"
                onChange={handleChange}
            >
                {colorsToChoose}
            </Select>
        </FormControl>
    );
};

export default CollectionColorSelect;
