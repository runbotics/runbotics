import { blueGrey, blue, green, orange } from '@mui/material/colors';


interface ICollectionColor {
    name: string,
    hex: string
}

export type ColorName =
 'LIGHT_ORANGE' | 'DARK_ORANGE' | 'LIGHT_GREEN' | 'DARK_GREEN' | 'LIGHT_BLUE' | 'DARK_BLUE' | 'LIGHT_GREY' | 'DARK_GREY'

export const CollectionColors: {[key in ColorName]: ICollectionColor} = {
    LIGHT_ORANGE: {name: 'Light orange', hex: orange[300]},
    DARK_ORANGE: {name: 'Dark orange', hex: orange[600]},
    LIGHT_GREEN: {name: 'Light green', hex: green.A200},
    DARK_GREEN: {name: 'Dark green', hex: green.A700},
    LIGHT_BLUE: {name: 'Light blue', hex: blue[200]},
    DARK_BLUE: {name: 'Dark blue', hex: blue[500]},
    LIGHT_GREY: {name: 'Light grey', hex: blueGrey[200]},
    DARK_GREY: {name: 'Dark grey', hex: blueGrey[300]},
};
