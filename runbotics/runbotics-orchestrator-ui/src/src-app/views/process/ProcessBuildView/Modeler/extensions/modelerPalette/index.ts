import ModelerPalette from './ModelerPalette';
import './modeler-palette.module.scss';


// eslint-disable-next-line import/no-anonymous-default-export
export default {
    __init__: ['customPaletteProvider'],
    customPaletteProvider: ['type', ModelerPalette],
};
