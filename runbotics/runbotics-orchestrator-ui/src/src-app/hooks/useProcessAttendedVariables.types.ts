import { ModdleElement } from '#src-app/views/process/ProcessBuildView/Modeler/helpers/elementParameters';

export interface Scope {
    id: string;
    children?: Scope[];
}

export interface ScopedModdleElement extends ModdleElement {
    scopeId: string;
}
