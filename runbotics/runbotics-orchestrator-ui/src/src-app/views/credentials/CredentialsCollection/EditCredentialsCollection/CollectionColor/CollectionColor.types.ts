import { blueGrey, blue, green, orange } from '@mui/material/colors';

interface ICollectionColor {
    name: string;
    hex: string;
}

export const DEFAULT_CREDENTIALS_COLLECTION_COLOR = 'DARK_ORANGE';

export type ColorNames =
    | 'LIGHT_ORANGE'
    | 'DARK_ORANGE'
    | 'LIGHT_GREEN'
    | 'DARK_GREEN'
    | 'LIGHT_BLUE'
    | 'DARK_BLUE'
    | 'LIGHT_GREY'
    | 'DARK_GREY';

export const collectionColors: { [key in ColorNames]: ICollectionColor } = {
    LIGHT_ORANGE: { name: 'light orange', hex: orange[300] },
    DARK_ORANGE: { name: 'dark orange', hex: orange[600] },
    LIGHT_GREEN: { name: 'light green', hex: green.A200 },
    DARK_GREEN: { name: 'dark green', hex: green.A700 },
    LIGHT_BLUE: { name: 'light blue', hex: blue[200] },
    DARK_BLUE: { name: 'dark blue', hex: blue[500] },
    LIGHT_GREY: { name: 'light grey', hex: blueGrey[200] },
    DARK_GREY: { name: 'dark grey', hex: blueGrey[300] }
};

export type CollectionColorHex = (typeof collectionColors)[ColorNames]['hex'];

export type CollectionColorName = (typeof collectionColors)[ColorNames]['hex'];

const hexToColorName: { [hex: string]: ColorNames } = Object.keys(collectionColors).reduce((acc, colorName) => {
    const key = colorName as ColorNames;
    const hex = collectionColors[key].hex;
    acc[hex] = key;
    return acc;
}, {} as { [hex: string]: ColorNames });

export const getColorNameByHex = (hex: string): ColorNames | undefined => hexToColorName[hex];
