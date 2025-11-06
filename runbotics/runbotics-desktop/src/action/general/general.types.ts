// -- action
export type StartProcessActionInput = {
    processId: number;
    variables: Record<string, any>;
};
export type StartProcessActionOutput = object;

// -- action
export type DelayActionInput = {
    delay: number;
    unit: 'Milliseconds' | 'Seconds';
};
export type DelayActionOutput = object;

// -- action
export type ConsoleLogActionInput = {
    variables: Record<string, any>; //obsluz to w pdf file
};
export type ConsoleLogActionOutput = object;

// -- action
export type ThrowErrorActionInput = {
    message?: string;
};
export type ThrowErrorActionOutput = object;
