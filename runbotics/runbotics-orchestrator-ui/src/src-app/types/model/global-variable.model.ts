import { VariableType } from '../../views/variable/Variable.types';
import { IUser } from './user.model';

export interface IGlobalVariable {
    id?: number;
    name: string;
    description: string | null;
    type: VariableType;
    value: string | null;
    lastModified?: string | null;
    user?: IUser | null;
}
