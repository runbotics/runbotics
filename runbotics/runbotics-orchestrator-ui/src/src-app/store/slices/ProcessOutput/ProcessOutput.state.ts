import { ProcessOutput } from 'runbotics-common/dist/model/api/process-output.model';

export interface ProcessOutputState {
    loading: boolean;
    processOutputs: ProcessOutput[];
}
