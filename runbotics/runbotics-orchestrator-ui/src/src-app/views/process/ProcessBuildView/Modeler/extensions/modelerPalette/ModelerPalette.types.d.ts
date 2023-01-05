// TODO: If the library starts exporting types, infer from them instead
// runbotics\common\temp\node_modules\.pnpm\bpmn-js@8.7.1\node_modules\bpmn-js\lib\features\palette\PaletteProvider.js

export type EntryProperties = {
    group?: string;
    className?: string;
    title?: string;
    action?: Partial<Record<'dragstart' | 'click', (event: any) => void>>;
};

export type Entries = Record<string, EntryProperties>;

export type BpmnEntryName =
    | 'hand-tool'
    | 'lasso-tool'
    | 'space-tool'
    | 'global-connect-tool'
    | 'tool-separator'
    | 'create.start-event'
    | 'create.intermediate-event'
    | 'create.end-event'
    | 'create.exclusive-gateway'
    | 'create.task'
    | 'create.data-object'
    | 'create.data-store'
    | 'create.subprocess-expanded'
    | 'create.participant-expanded'
    | 'create.group';
export type BpmnEntries = Record<BpmnEntryName, EntryProperties>;

export type InheritedEntries = Partial<Record<BpmnEntryName, Partial<EntryProperties>>>;
