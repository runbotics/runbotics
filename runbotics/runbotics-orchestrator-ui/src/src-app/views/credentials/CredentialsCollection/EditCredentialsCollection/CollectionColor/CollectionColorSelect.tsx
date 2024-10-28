import { FC } from 'react';

import { FormControl, InputLabel, MenuItem, Typography } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import useTranslations from '#src-app/hooks/useTranslations';

import { ColorDot } from './CollectionColor.styles';
import { collectionColors, ColorNames, getColorNameByHex } from './CollectionColor.utils';
import { EditCredentialsCollectionDto } from '../../CredentialsCollection.types';

interface CollectionColorSelectProps {
    currentColor: ColorNames;
    setFormState: (state: ((prevState: EditCredentialsCollectionDto) => EditCredentialsCollectionDto)) => void;
}

const CollectionColorSelect: FC<CollectionColorSelectProps> = ({ currentColor, setFormState }) => {
    const { translate } = useTranslations();
    const collectionColor = currentColor ? collectionColors[currentColor].hex : collectionColors.DARK_ORANGE.hex;

    const handleChange = (event: SelectChangeEvent) => {
        const colorName = getColorNameByHex(event.target.value);
        setFormState((prevState) => ({ ...prevState, color: colorName }));
    };

    const colorsToChoose = Object.values(collectionColors).map((color) => (
        <MenuItem key={color.hex} value={color.hex}>
            <ColorDot collectionColor={getColorNameByHex(color.hex)} />
            <Typography>{color.name}</Typography>
        </MenuItem>
    ));

    return (
        <FormControl fullWidth>
            <InputLabel id="collection_color">{translate('Credentials.Collection.Edit.CollectionColor.Label')}</InputLabel>
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
