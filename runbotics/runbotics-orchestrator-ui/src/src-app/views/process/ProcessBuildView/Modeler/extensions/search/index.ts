import SearchPadModule from 'diagram-js/lib/features/search-pad';

import BpmnSearchProvider from './BpmnSearch';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    __depends__: [SearchPadModule],
    __init__: ['bpmnSearch'],
    bpmnSearch: ['type', BpmnSearchProvider]
};
