import { useEffect, useMemo } from 'react';

import useTranslations, {
    translate as t,
} from '#src-app/hooks/useTranslations';

import { useDispatch, useSelector } from '#src-app/store';

import { processActions } from '#src-app/store/slices/Process';

import useProcessVariables from './useProcessVariables';

import { ActionVariableObject } from './useProcessVariables.types';

const SERVICES = [
    'environment.services.idt',
    'environment.services.slice',
    'environment.services.merge',
    'environment.services.decrement',
    'environment.services.increment',
    'environment.services.get',
    'environment.services.getLength',
    'environment.services.getLastElemIdx',
    'environment.services.jsonAsString',
    'environment.services.objectAsBoolean',
    'environment.services.stringObjectAsBoolean',
    'environment.services.orObjectsAsBoolean',
    'environment.services.andObjectsAsBoolean',
    'environment.services.isEmptyString',
    'environment.services.isEqualStr',
    'environment.services.isEqual',
    'environment.services.isNotEqual',
    'environment.services.incrementAndCompare',
    'environment.services.isBlank',
    'environment.services.push',
    'environment.services.concat',
    'environment.services.splitAndPick',
    'environment.services.parseJson',
    'environment.services.csvToObject',
    'environment.services.comaSeparatedToArray',
    'environment.services.applyConverters',
    'environment.services.withDefault',
    'environment.services.getCurrentDate',
    'environment.services.getPreviousWorkday',
    'environment.services.checkCurrentTimeBefore',
    'environment.services.checkCurrentTimeAfter',
    'environment.services.checkCurrentTimeBetween',
    'environment.services.getSecondsToNextDayTime',
    'environment.services.getSecondsToSpecifiedHour',
    'environment.services.getFirstWorkingDayOfCurrentMonth',
    'environment.services.getFirstWorkingDayOfFutureMonth',
    'environment.services.getLastWorkingDayOfCurrentMonth',
    'environment.services.getLastWorkingDayOfFutureMonth',
    'environment.services.checkFirstWorkingDayOfCurrentMonth',
    'environment.services.checkLastWorkingDayOfCurrentMonth',
    'environment.services.getSecondsToFirstWorkingDayOfMonth',
    'environment.services.transformArraysToArray',
    'environment.services.getCurrentShortMonthYear',
    'environment.services.compareMaps',
    'environment.services.diffMaps',
    'environment.services.objFromArray',
    'environment.services.readFromStorage',
];

const UTILS = [
    'false',
    'true',
    'content.output',
    'environment',
    'environment.output',
];

const VARIABLES = [
    'tempFolder',
    'userEmail'
];

const SERVICES_MAPPED = SERVICES.map((service) => ({
    value: `\${${service}}`,
    label: `\${${service}}`,
    name: service,
    group: t(
        'Process.Details.Modeler.Widgets.ElementAwareAutocomplete.Groups.Services'
    ),
}));

const UTILS_MAPPED = UTILS.map((util) => ({
    value: `\${${util}}`,
    label: `\${${util}}`,
    name: util,
    group: t(
        'Process.Details.Modeler.Widgets.ElementAwareAutocomplete.Groups.Utils'
    ),
}));

const VARIABLES_MAPPED = VARIABLES.map((variable) => ({
    label: variable,
    value: variable,
    group: t(
        'Process.Details.Modeler.Widgets.ElementAwareAutocomplete.Groups.Variables'
    ),
}));

const reduceList = (list: any[]) =>
    list.reduce((previousValue, currentValue) => {
        const newPrev = previousValue;
        newPrev[currentValue.value] = currentValue;
        return newPrev;
    }, {});

export interface Options {
    [key: string]: {
        label: string;
        value: string;
        group: string;
        name: string;
        actionId?: string;
    };
}

export interface Variable {
    name: string;
    actionId?: string;
}

// eslint-disable-next-line max-lines-per-function
const useOptions = () => {
    const dispatch = useDispatch();
    const {
        selectedElement,
        customValidationErrors,
        options: prevOptions,
        variables: prevVariables,
    } = useSelector((state) => state.process.modeler);
    const { translate } = useTranslations();
    const {
        globalVariables,
        inputActionVariables,
        outputActionVariables,
        attendedVariables,
        loopVariables: scopedLoopVariables,
        allActionVariables,
    } = useProcessVariables(selectedElement?.parent?.id);

    const attendedProcessVariables = attendedVariables.map((variable) => ({
        label: variable.name,
        value: variable.name,
        group: translate(
            'Process.Details.Modeler.Widgets.ElementAwareAutocomplete.Groups.Variables'
        ),
    }));

    const extractOutputs = (outputVariables: ActionVariableObject[]) => {
        const outputs = outputVariables.map((outputVariable) => ({
            label: outputVariable.name,
            value: outputVariable.name,
            name: outputVariable.name,
            ...(outputVariable?.actionId && { actionId: outputVariable?.actionId }),
            group: translate(
                'Process.Details.Modeler.Widgets.ElementAwareAutocomplete.Groups.Outputs'
            ),
        }));

        const dollarOutputs = outputs.map((option) => ({
            ...option,
            label: `\${environment.output.${option.label}}`,
            value: `\${environment.output.${option.value}}`,
        }));
        const hashOutputs = outputs.map((option) => ({
            ...option,
            label: `#{${option.label}}`,
            value: `#{${option.value}}`,
        }));

        return [...dollarOutputs, ...hashOutputs];
    };

    const outputVariables = extractOutputs(outputActionVariables);

    const groupedLocalVariables = inputActionVariables.map((variable) => ({
        label: variable.name,
        value: variable.name,
        ...(variable?.actionId && { actionId: variable?.actionId }),
        group: translate(
            'Process.Details.Modeler.Widgets.ElementAwareAutocomplete.Groups.Variables'
        ),
    }));

    const allLocalVariables = allActionVariables.map((variable) => ({
        value: variable.name,
        ...(variable?.actionId && { actionId: variable?.actionId }),
    }));

    const groupedLoopVariables = scopedLoopVariables.map((variable) => ({
        label: variable.name,
        value: variable.name,
        group: translate(
            'Process.Details.Modeler.Widgets.ElementAwareAutocomplete.Groups.Utils'
        ),
    }));

    const groupedGlobalVariables = globalVariables.map((variable) => ({
        label: variable.name,
        value: variable.name,
        group: translate(
            'Process.Details.Modeler.Widgets.ElementAwareAutocomplete.Groups.Variables'
        ),
    }));

    const options: Options = useMemo(() => {
        let result = [];

        const defaultOptions = [...SERVICES_MAPPED, ...UTILS_MAPPED];
        result = [...defaultOptions, ...result];

        const variables = [
            ...groupedLocalVariables,
            ...groupedGlobalVariables,
            ...attendedProcessVariables,
            ...VARIABLES_MAPPED,
        ];

        const dollarVariables = variables.map((option) => ({
            ...option,
            label: `\${environment.variables.${option.value}}`,
            value: `\${environment.variables.${option.value}}`,
            name: option.value,
        }));

        const hashVariables = variables.map((option) => ({
            ...option,
            label: `#{${option.value}}`,
            value: `#{${option.value}}`,
            name: option.value,
        }));

        const loopVariables = groupedLoopVariables.map((option) => ({
            ...option,
            label: `\${${option.value}}`,
            value: `\${${option.value}}`,
            name: option.value,
        }));

        result = [
            ...dollarVariables,
            ...hashVariables,
            ...outputVariables,
            ...result,
            ...loopVariables,
        ];

        return reduceList(result);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedElement]);

    const variables = useMemo<Variable[]>(() => {
        const defaultVars = [
            ...VARIABLES,
            ...SERVICES,
            ...UTILS
        ].map(variable => ({name: variable}));

        const vars = [
            ...allLocalVariables,
            ...groupedGlobalVariables,
            ...attendedProcessVariables,
        ].map(variable => ({
            name: variable.value,
            ...('actionId' in variable && { actionId: variable?.actionId }),
        }));

        return [...vars, ...defaultVars];
    }, [selectedElement]);

    useEffect(() => {
        if (customValidationErrors.length === 0) {
            dispatch(processActions.setOptions(options));
            dispatch(processActions.setVariables(variables));
        }
    }, [options]);

    return {
        options: prevOptions ?? options,
        variables: prevVariables ?? variables,
    };
};

export default useOptions;
