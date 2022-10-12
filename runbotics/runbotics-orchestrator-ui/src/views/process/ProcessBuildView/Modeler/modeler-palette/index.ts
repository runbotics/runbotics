import ModelerPalette from './ModelerPalette';
import './modeler-palette.module.scss';

export * from './ModelerPalette.types.d';

export default {
    __init__: ['customPaletteProvider'],
    customPaletteProvider: ['type', ModelerPalette],
};
