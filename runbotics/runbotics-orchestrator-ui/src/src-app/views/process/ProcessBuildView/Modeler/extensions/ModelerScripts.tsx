import CustomContextPad from './custom/CustomContextPad';
// import CustomPalette from './custom/CustomPalette';
import CustomRenderer from './custom/CustomRenderer';
// import './ModelerScripts.scss';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    __init__: ['customContextPad'],
    customContextPad: ['type', CustomContextPad],
};
