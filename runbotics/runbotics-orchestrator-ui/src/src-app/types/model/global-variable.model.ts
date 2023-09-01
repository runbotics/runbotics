import { IUser } from './user.model';
import { VariableType } from '../../views/variable/Variable.types';

export type Creator = Pick<IUser, 'id' | 'login'>;

export interface IGlobalVariable {
    id?: number;
    name: string;
    description: string | null;
    type: VariableType;
    value: string | null;
    lastModified?: string | null;
    user?: IUser | null;
    creator?: Creator | null;
}
