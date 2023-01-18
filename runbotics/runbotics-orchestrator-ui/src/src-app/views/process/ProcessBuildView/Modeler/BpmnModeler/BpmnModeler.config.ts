import propertiesPanelModule from 'bpmn-js-properties-panel';
import { RunboticModdleDescriptor } from 'runbotics-common';

import Clipboard from '../extensions/clipboard';
import ContextPad from '../extensions/contextPad';
import BasicModelerModule from '../extensions/customRenderer/Modeler.module';
import modelerPalette from '../extensions/modelerPalette';
import searchModule from '../extensions/search';
import ZoomScrollModule from '../extensions/zoomscroll';

export const getBpmnModelerConfig = (offsetTop: number) => {
    const clipboard = new Clipboard();

    return {
        container: '#bpmn-modeler',
        additionalModules: [
            modelerPalette,
            propertiesPanelModule,
            BasicModelerModule,
            { clipboard: ['value', clipboard] },
            ZoomScrollModule,
            ContextPad,
            searchModule
        ],
        moddleExtensions: {
            camunda: RunboticModdleDescriptor
        },
        keyboard: {
            bindTo: window
        },
        width: '100%',
        height: `calc(100vh - ${offsetTop}px)`
    };
};
