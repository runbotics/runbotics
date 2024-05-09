import { useState } from 'react';

import { FormControl, InputLabel, MenuItem, Typography } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import { ColorDot } from './CollectionColor.styled';
import { CollectionColors, ColorName } from './CollectionColor.types';

const CollectionColorSelect = () => {
    const [collectionColor, setCollectionColor] = useState(CollectionColors.DARK_ORANGE.hex);

    const handleChange = (event: SelectChangeEvent) => {
        setCollectionColor(event.target.value);
    };

    const colorsToChoose = Object.keys(CollectionColors).map((colorName: ColorName) => (
        <MenuItem key={CollectionColors[colorName].hex} value={CollectionColors[colorName].hex}>
            <ColorDot collectionColor={CollectionColors[colorName].hex}/>
            <Typography>
                {CollectionColors[colorName].name}
            </Typography>
        </MenuItem>
    ));


    return (
     
        <FormControl fullWidth >
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
