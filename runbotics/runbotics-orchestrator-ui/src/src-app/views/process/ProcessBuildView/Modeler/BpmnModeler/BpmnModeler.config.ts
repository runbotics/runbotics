import propertiesPanelModule from 'bpmn-js-properties-panel';
import { RunboticModdleDescriptor } from 'runbotics-common';

import ContextPad from '../extensions/contextPad';
import BasicModelerModule from '../extensions/customRenderer/Modeler.module';
import LocalStorageCopyModule from '../extensions/localStorage';
import modelerPalette from '../extensions/modelerPalette';
import searchModule from '../extensions/search';
import ZoomScrollModule from '../extensions/zoomscroll';

export const getBpmnModelerConfig = (offsetTop: number) => ({
    container: '#bpmn-modeler',
    additionalModules: [
        modelerPalette,
        propertiesPanelModule,
        BasicModelerModule,
        ZoomScrollModule,
        ContextPad,
        searchModule,
        LocalStorageCopyModule
    ],
    moddleExtensions: {
        camunda: RunboticModdleDescriptor
    },
    keyboard: {
        bindTo: window
    },
    width: '100%',
    height: `calc(100vh - ${offsetTop}px)`
});
