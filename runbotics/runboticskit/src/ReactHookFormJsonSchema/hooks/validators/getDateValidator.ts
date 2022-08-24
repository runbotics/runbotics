import { RegisterOptions } from 'react-hook-form';

import { JSONSchemaType } from '../../JSONSchema';
import { ErrorTypes } from './types';
import { isMoment, Moment } from 'moment';

export const getDateValidator = (currentObject: JSONSchemaType, baseValidator: RegisterOptions): RegisterOptions => {
    baseValidator.validate = {
        ...baseValidator.validate,
        isDate: (value: any) => {
            if (isMoment(value)) {
                const momentValue = value as Moment;
                return momentValue.isValid();
            } else {
                return true;
            }
        },
    };

    return baseValidator;
};
