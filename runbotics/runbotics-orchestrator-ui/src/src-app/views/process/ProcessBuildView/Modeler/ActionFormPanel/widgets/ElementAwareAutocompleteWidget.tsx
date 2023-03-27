/* eslint-disable max-lines-per-function */
import React, { FC } from 'react';

import { WidgetProps } from '@rjsf/core';

import styled from 'styled-components';



import If from '#src-app/components/utils/If';
import useProcessVariables from '#src-app/hooks/useProcessVariables';
import { ActionVariableObject } from '#src-app/hooks/useProcessVariables.types';
import useTranslations, {
    translate as t
} from '#src-app/hooks/useTranslations';

import { useSelector } from '#src-app/store';

import AutocompleteWidget from './AutocompleteWidget';
import InfoButtonTooltip from './components/InfoButtonTooltip';


const services = [
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
    'environment.services.readFromStorage'
].map(service => ({
    value: `\${${service}}`,
    label: `\${${service}}`,
    group: t(
        'Process.Details.Modeler.Widgets.ElementAwareAutocomplete.Groups.Services'
    )
}));


const utils = [
    'false',
    'true',
    'content.output',
    'environment',
    'environment.output'
].map(util => ({
    value: `\${${util}}`,
    label: `\${${util}}`,
    group: t(
        'Process.Details.Modeler.Widgets.ElementAwareAutocomplete.Groups.Utils'
    )
}));


const reduceList = (list: any[]) =>
    list.reduce((previousValue, currentValue) => {
        const newPrev = previousValue;
        newPrev[currentValue.value] = currentValue;
        return newPrev;
    }, {});

interface ElementAwareAutocompleteProps extends WidgetProps {
    options: {
        info?: string;
    };
    customErrors?: string[];
}

const AutocompleteWrapper = styled.div`
    display: flex;
    width: 100%;
    align-items: center;
`;

const ElementAwareAutocompleteWidget: FC<ElementAwareAutocompleteProps> =
props => {
    const { selectedElement } = useSelector(
        state => state.process.modeler
    );
    const { translate } = useTranslations();
    const { globalVariables, inputActionVariables, outputActionVariables, attendedVariables } = useProcessVariables();
    

    const attendedProcessVariables = attendedVariables.map(variable => ({
        label: variable.name,
        value: variable.name,
        group: translate(
            'Process.Details.Modeler.Widgets.ElementAwareAutocomplete.Groups.Variables'
        )
    }));

    const extractOutputs = (outputVariables: ActionVariableObject[]) => {
        const outputs = outputVariables.map(
            outputVariable => ({
                label: outputVariable.name,
                value: outputVariable.name,
                group: translate(
                    'Process.Details.Modeler.Widgets.ElementAwareAutocomplete.Groups.Outputs'
                )
            })
        );

        const dollarOutputs = outputs.map(option => ({
            ...option,
            label: `\${environment.output.${option.label}}`,
            value: `\${environment.output.${option.value}}`
        }));
        const hashOutputs = outputs.map(option => ({
            ...option,
            label: `#{${option.label}}`,
            value: `#{${option.value}}`
        }));

        return [...dollarOutputs, ...hashOutputs];
    };

    const outputVariables = extractOutputs(outputActionVariables);

    const groupedLocalVariable = inputActionVariables.map(variable => ({
        label: variable.name,
        value: variable.name,
        group: translate(
            'Process.Details.Modeler.Widgets.ElementAwareAutocomplete.Groups.Variables'
        )
    })); 
            

    const groupedGlobalVariables = globalVariables.map(variable => ({
        label: variable.name,
        value: variable.name,
        group: translate(
            'Process.Details.Modeler.Widgets.ElementAwareAutocomplete.Groups.Variables'
        )
    }));

    const options: Record<
    string,
    { label: string; value: any; group: any }
    > = React.useMemo(() => {
        let result = [];
        
        const defaultOptions = [...services, ...utils];
        result = [...defaultOptions, ...result];
        
        const variables = [...groupedLocalVariable, ...groupedGlobalVariables, ...attendedProcessVariables];

        const dollarVariables = variables.map(option => ({
            ...option,
            label: `\${environment.variables.${option.value}}`,
            value: `\${environment.variables.${option.value}}`
        }));
        const hashVariables = variables.map(option => ({
            ...option,
            label: `#{${option.value}}`,
            value: `#{${option.value}}`
        }));

        result = [...dollarVariables, ...hashVariables, ...outputVariables, ...result];

        return reduceList(result);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedElement]);

    const optionValues = React.useMemo(
        () => ({
            'ui:options': Object.values(options).map(option => option.value)
        }),
        [options]
    );

    return (
        <AutocompleteWrapper>
            <AutocompleteWidget
                {...props}
                value={props.value}
                groupBy={option => options[option].group}
                options={optionValues}
            />
            <If condition={Boolean(props.options?.info)}>
                <InfoButtonTooltip message={props.options?.info} />
            </If>
        </AutocompleteWrapper>
    );
};

export default ElementAwareAutocompleteWidget;
