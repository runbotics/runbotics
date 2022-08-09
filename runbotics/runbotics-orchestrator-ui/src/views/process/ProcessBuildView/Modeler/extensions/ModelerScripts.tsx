import CustomContextPad from './custom/CustomContextPad';
import CustomPalette from './custom/CustomPalette';
import CustomRenderer from './custom/CustomRenderer';
import './ModelerScripts.scss';

export default {
    __init__: ['customContextPad', 'customPalette', 'customRenderer'],
    customContextPad: ['type', CustomContextPad],
    customPalette: ['type', CustomPalette],
    customRenderer: ['type', CustomRenderer],
};
