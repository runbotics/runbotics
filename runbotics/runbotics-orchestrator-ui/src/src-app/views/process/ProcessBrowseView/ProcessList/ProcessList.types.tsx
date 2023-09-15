import { IProcess } from 'runbotics-common';

interface IProcessWithFilters extends IProcess {
    name: string | null;
    createdByName: string | null;
    tagName: string | null;
}

export default IProcessWithFilters;
