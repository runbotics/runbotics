import { IProcess } from 'runbotics-common';

export interface ModelerImperativeHandle {
    export: () => Promise<string>;
}

export interface ModelerProps {
    definition: string;
    readOnly?: boolean;
    offsetTop: number | null;
    process: IProcess;
    onSave: () => void;
    onImport: (definition: string) => void;
    onExport: () => void;
}

export interface ModelerViewboxOpts {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface ModelerViewboxResult {
    width: number;
    height: number;
}

export interface ModelerRegistryElement {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface ModelerHTMLCanvasElement extends HTMLCanvasElement {
    zoom: (precition: string, scale: string) => void;
    viewbox: (opts?: ModelerViewboxOpts) => ModelerViewboxResult;
}
