import { v4 as uuidv4 } from 'uuid';

import { translate } from 'src/hooks/useTranslations';
import { IGlobalVariable } from 'src/types/model/global-variable.model';

import { VariableType } from '../Variable.types';
import { Validator, VariableState, VariableValue } from './VariableDetails.types';

export const initialVariableState: VariableState = {
    name: '',
    description: '',
    value: '',
    type: VariableType.STRING,
};

export const mapVariableToInnerState = (variable: IGlobalVariable | undefined): VariableState => {
    if (!variable) return initialVariableState;
    if (variable?.type === VariableType.LIST) 
    { return {
        ...variable,
        type: VariableType.LIST,
        value: (JSON.parse(variable?.value) as string[])
            .map<VariableValue>((value) => ({ id: uuidv4(), value })),
    }; }
    
    if (variable?.type === VariableType.BOOLEAN) 
    { return {
        ...variable,
        type: VariableType.BOOLEAN,
    }; }
    
    return { ...variable, type: VariableType.STRING };
};

export const requiredFieldValidator: Validator = {
    error: true,
    helperText: translate('Variables.Details.Validation.FieldRequired'),
};

export const valueListValidator: Validator = {
    error: true,
    helperText: translate('Variables.Details.Validation.EmptyList'),
};
