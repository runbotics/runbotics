/* eslint-disable max-lines-per-function */
import React, { FC } from 'react';

import { getVariablesForScope } from '@bpmn-io/extract-process-variables';
import { WidgetProps } from '@rjsf/core';
import { is } from 'bpmn-js/lib/util/ModelUtil';

import styled from 'styled-components';

import If from '#src-app/components/utils/If';
import { useModelerContext } from '#src-app/hooks/useModelerContext';
import useTranslations, {
    translate as t
} from '#src-app/hooks/useTranslations';

import { useSelector } from '#src-app/store';
import { globalVariableSelector } from '#src-app/store/slices/GlobalVariable';
import { currentProcessSelector } from '#src-app/store/slices/Process';

import { BPMNElement, CamundaInputOutputElement } from '../../BPMN';
import BPMNHelperFunctions from '../BPMNHelperFunctions';
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
        const { selectedElement, passedInVariables } = useSelector(
            state => state.process.modeler
        );

        const context = useModelerContext();
        const { translate } = useTranslations();
        const { executionInfo, isAttended } = useSelector(
            currentProcessSelector
        );
        const { globalVariables } = useSelector(globalVariableSelector);

        const attendedProcessVariables =
            isAttended && executionInfo
                ? passedInVariables.map(variable => ({
                      label: variable,
                      value: variable,
                      group: translate(
                          'Process.Details.Modeler.Widgets.ElementAwareAutocomplete.Groups.Variables'
                      )
                  }))
                : [];

        const extractOutputs = (scope, rootElement) => {
            let variableOutputs = [];
            if (
                rootElement.loopCharacteristics &&
                rootElement.loopCharacteristics.elementVariable
            ) {
                const { elementVariable } = rootElement.loopCharacteristics;
                const localVariables = [
                    {
                        value: `\${environment.variables.content.${elementVariable}}`,
                        label: `\${environment.variables.content.${elementVariable}}`,
                        group: translate(
                            'Process.Details.Modeler.Widgets.ElementAwareAutocomplete.Groups.Local'
                        )
                    },
                    {
                        value: `#{${elementVariable}}`,
                        label: `#{${elementVariable}}`,
                        group: translate(
                            'Process.Details.Modeler.Widgets.ElementAwareAutocomplete.Groups.Local'
                        )
                    }
                ];
                variableOutputs = [...localVariables, ...variableOutputs];
            }

            const outputs: any[] = getVariablesForScope(scope, rootElement).map(
                option => ({
                    label: option.name,
                    value: option.name,
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

            return [...dollarOutputs, ...hashOutputs, ...variableOutputs];
        };

        const extractLocalVariable = (
            inputOutput: CamundaInputOutputElement
        ) => {
            const localVariable = inputOutput.inputParameters.find(
                inputParameter => inputParameter.name === 'variable'
            );
            if (localVariable) {
                return {
                    label: localVariable.value,
                    value: localVariable.value,
                    group: translate(
                        'Process.Details.Modeler.Widgets.ElementAwareAutocomplete.Groups.Variables'
                    )
                };
            }
            return undefined;
        };

        const extractGlobalVariables = (
            inputOutput: CamundaInputOutputElement
        ) => {
            const globalVariableList = inputOutput.inputParameters.find(
                inputParameter => inputParameter.name === 'globalVariables'
            );

            if (globalVariableList) {
                return globalVariableList.definition.items.map(item => {
                    const globalVariableName = globalVariables.find(
                        variable => variable.id === Number(item.value)
                    )?.name;

                    if (!globalVariableName) {
                        return undefined;
                    }

                    return {
                        label: globalVariableName,
                        value: globalVariableName,
                        group: translate(
                            'Process.Details.Modeler.Widgets.ElementAwareAutocomplete.Groups.Variables'
                        )
                    };
                });
            }
            return undefined;
        };

        const options: Record<
            string,
            { label: string; value: any; group: any }
        > = React.useMemo(() => {
            let result = [];

            const defaultOptions = [...services, ...utils];
            result = [...defaultOptions, ...result];

            if (!selectedElement) {
                return reduceList(result);
            }

            const scope = BPMNHelperFunctions.getScope(selectedElement);
            const rootElement =
                BPMNHelperFunctions.getParentElement(selectedElement);

            if (rootElement) {
                result = [...extractOutputs(scope, rootElement), ...result];
            }

            const assignVariablesElements = context?.modelerRef
                ? context.modelerRef?.current
                      ?.get('elementRegistry')
                      .filter((element: BPMNElement) =>
                          is(element, 'bpmn:Task')
                      )
                      .filter(
                          (element: BPMNElement) =>
                              element.businessObject.actionId ===
                                  'variables.assign' ||
                              element.businessObject.actionId ===
                                  'variables.assignList' ||
                              element.businessObject.actionId ===
                                  'variables.assignGlobalVariable'
                      )
                : [];

            const variables = assignVariablesElements
                .map(assignVariablesElement => {
                    const inputOutput: CamundaInputOutputElement =
                        assignVariablesElement.businessObject?.extensionElements
                            ?.values[0] as CamundaInputOutputElement;

                    if (!inputOutput) {
                        return undefined;
                    }
                    return (
                        extractLocalVariable(inputOutput) ??
                        extractGlobalVariables(inputOutput)
                    );
                })
                .concat(attendedProcessVariables)
                .filter(variable => variable !== undefined);

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

            result = [...dollarVariables, ...hashVariables, ...result];
            result = [...dollarVariables, ...hashVariables, ...result];

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
