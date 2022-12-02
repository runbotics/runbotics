import { IProcess } from 'runbotics-common';

interface IProcessWithFilters extends IProcess {
    createdByName?: string | null;
}

export default IProcessWithFilters;
