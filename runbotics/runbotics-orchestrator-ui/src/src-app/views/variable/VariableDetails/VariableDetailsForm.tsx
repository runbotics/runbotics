import React, {
    ChangeEvent, Dispatch, FunctionComponent, SetStateAction,
} from 'react';

import { Divider, MenuItem, TextField } from '@mui/material';


import useTranslations from '#src-app/hooks/useTranslations';

import ValueList from './ValueList/ValueList';
import { VariableState, VariableValidation } from './VariableDetails.types';
import { mapVariableToInnerState, requiredFieldValidator, valueListValidator } from './VariableDetails.utils';
import { VariableDetailState, VariableType } from '../Variable.types';


interface VariableDetailsFormProps {
    variableDetailState: VariableDetailState;
    variable: VariableState;
    setVariable: Dispatch<SetStateAction<VariableState>>;
    validation: VariableValidation | undefined;
    setValidation: Dispatch<SetStateAction<VariableValidation>>;
}

const VariableDetailsForm: FunctionComponent<VariableDetailsFormProps> = ({
    variableDetailState, setVariable, variable, validation, setValidation,
}) => {
    const { translate } = useTranslations();
    const getNameValidator = () => (validation?.name) && requiredFieldValidator;

    const getStringValueValidator = () => (validation?.value) && requiredFieldValidator;

    const getListValueValidator = () => (validation?.list) && valueListValidator;

    const getDefaultValue = (type: VariableType) => {
        switch (type) {
            case VariableType.STRING:
                return '';
            case VariableType.BOOLEAN:
                return 'true';
            case VariableType.LIST:
                return JSON.stringify(['']);
            default:
                return undefined;
        }
    };

    const handleTypeChange = (event: ChangeEvent<HTMLInputElement>) => {
        const type = event.target.value as VariableType;
        const value = variableDetailState.variable?.type === type
            ? variableDetailState?.variable.value
            : getDefaultValue(type);
        setVariable((prevState) => mapVariableToInnerState({ ...prevState, type, value }));
        setValidation((prevState) => ({ ...prevState, value: false, list: false }));
    };

    const handleBooleanValueChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setVariable((prevState) => ({ ...prevState, type: VariableType.BOOLEAN, value }));
    };

    const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        const name = event.target.value;
        setVariable((prevState) => ({ ...prevState, name }));
        if (name.trim() !== '') 
        { setValidation((prevState) => ({ ...prevState, name: false })); }
        
    };

    const handleDescriptionChange = (event: ChangeEvent<HTMLInputElement>) => {
        setVariable((prevState) => ({ ...prevState, description: event.target.value }));
    };

    const handleValueChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setVariable((prevState) => ({ ...prevState, type: VariableType.STRING, value }));
        if (value.trim() !== '') 
        { setValidation((prevState) => ({ ...prevState, value: false })); }
        
    };

    const renderValueComponent = () => {
        switch (variable?.type) {
            case VariableType.STRING:
                return (
                    <TextField
                        label={translate('Variables.Details.Form.Fields.Value')}
                        name="Value"
                        variant="outlined"
                        value={variable.value}
                        onChange={handleValueChange}
                        disabled={variableDetailState.readOnly}
                        {...getStringValueValidator()}
                    />
                );
            case VariableType.BOOLEAN:
                return (
                    <TextField
                        label={`*${translate('Variables.Details.Form.Fields.BooleanValue')}`}
                        name="value"
                        variant="outlined"
                        value={variable.value}
                        onChange={handleBooleanValueChange}
                        select
                        disabled={variableDetailState.readOnly}
                    >
                        <MenuItem value="true">{translate('Common.True')}</MenuItem>
                        <MenuItem value="false">{translate('Common.False')}</MenuItem>
                    </TextField>
                );
            case VariableType.LIST:
                return (
                    <>
                        <Divider orientation="horizontal" />
                        <ValueList
                            variable={variable}
                            setVariable={setVariable}
                            readOnly={variableDetailState.readOnly}
                        />
                    </>
                );
            default:
                return (<></>);
        }
    };

    return (
        <>
            <TextField
                autoFocus
                label={`*${translate('Variables.Details.Form.Fields.Name')}`}
                name="name"
                variant="outlined"
                value={variable.name}
                onChange={handleNameChange}
                disabled={variableDetailState.readOnly}
                {...getNameValidator()}
            />
            <TextField
                label={translate('Variables.Details.Form.Fields.Description')}
                name="description"
                variant="outlined"
                value={variable.description}
                onChange={handleDescriptionChange}
                disabled={variableDetailState.readOnly}
                multiline
            />
            <TextField
                label={translate('Variables.Details.Form.Fields.Type')}
                name="type"
                variant="outlined"
                value={variable.type}
                onChange={handleTypeChange}
                select
                disabled={variableDetailState.readOnly}
                {...getListValueValidator()}
            >
                <MenuItem value={VariableType.STRING}>{translate('Common.String')}</MenuItem>
                <MenuItem value={VariableType.BOOLEAN}>{translate('Common.Boolean')}</MenuItem>
                <MenuItem value={VariableType.LIST}>{translate('Common.List')}</MenuItem>
            </TextField>
            {renderValueComponent()}
        </>
    );
};

export default VariableDetailsForm;
