import internalBpmnActions from 'src/views/process/ProcessBuildView/Modeler/ConfigureActionPanel/Actions';

export enum ElementType {
    SERVICE_TASK = 'SERVICE_TASK',
    START_EVENT = 'START_EVENT',
    END_EVENT = 'END_EVENT',
    GATEWAY = 'GATEWAY',
    MERGE = 'MERGE',
}

export enum Direction {
    LEFT = 'left',
    RIGHT = 'right',
    TOP = 'top',
    BOTTOM = 'bottom',
}

type StartEventElement = CommonElementProps;

type EndEventElement = Pick<CommonElementProps, 'expression'>;

type GatewayElement = CommonElementProps;

type MergeElement = CommonElementProps & {
    mergeByLabel: string;
};

export type ServiceTaskElement = CommonElementProps & {
    bpmnAction: keyof typeof internalBpmnActions;
};

interface CommonElementProps {
    expression?: string;
    properties?: any;
    [Direction.RIGHT]?: BaseElement;
    [Direction.TOP]?: BaseElement;
    [Direction.LEFT]?: BaseElement;
    [Direction.BOTTOM]?: BaseElement;
}

type ElementOptions =
    | (ServiceTaskElement & { type: ElementType.SERVICE_TASK })
    | (GatewayElement & { type: ElementType.GATEWAY })
    | (StartEventElement & { type: ElementType.START_EVENT })
    | (EndEventElement & { type: ElementType.END_EVENT })
    | (MergeElement & { type: ElementType.MERGE });

type BaseElement = {
    label: string;
    input?: Record<string, any>;
    output?: string;
    expression?: string;
    default?: boolean;
} & ElementOptions;

export type Position = {
    x: number;
    y: number;
};

export type TemplatesSchema = {
    name: string;
    id: string;
    input?: Record<string, any>;
    output?: string;
} & BaseElement;

type ChildRecord = {
    label: string;
    direction: Direction;
    edgeProps: any;
};

export interface MapRecord {
    label: string;
    children: ChildRecord[];
    position: Position;
    shape: any;
    type: ElementType;
}

export interface CreateConnectionProps {
    sourceElement: MapRecord;
    targetElement: MapRecord;
    direction: Direction;
    edgeProps: any;
}
export interface CalculateOffsetProps {
    element: MapRecord;
    direction: Direction;
    offsetValues: { gateway: number; event: number };
    origin: 'target' | 'source';
}
