import React, { FC } from 'react';

import { getVariablesForScope } from '@bpmn-io/extract-process-variables';
import { WidgetProps } from '@rjsf/core';
import { is } from 'bpmn-js/lib/util/ModelUtil';

import useTranslations, { translate as t } from 'src/hooks/useTranslations';

import { useBpmnFormContext } from 'src/providers/BpmnForm.provider';
import { useSelector } from 'src/store';
import { currentProcessSelector } from 'src/store/slices/Process';

import { BPMNElement, CamundaInputOutputElement } from '../../BPMN';
import BPMNHelperFunctions from '../BPMNHelperFunctions';
import AutocompleteWidget from './AutocompleteWidget';

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
    'environment.services.readFromStorage',
].map((service) => ({
    value: `\${${service}}`,
    label: `\${${service}}`,
    group: t('Process.Details.Modeler.Widgets.ElementAwareAutocomplete.Groups.Services'),
}));

const utils = ['false', 'true', 'content.output', 'environment', 'environment.output'].map((util) => ({
    value: `\${${util}}`,
    label: `\${${util}}`,
    group: t('Process.Details.Modeler.Widgets.ElementAwareAutocomplete.Groups.Utils'),
}));

const ElementAwareAutocompleteWidget: FC<WidgetProps> = (props) => {
    const context = useBpmnFormContext();
    const { translate } = useTranslations();
    const { executionInfo, isAttended } = useSelector(currentProcessSelector);

    const attendedProcessVariables =
        isAttended && executionInfo
            ? context?.passedInVariables.map((variable) => ({
                label: variable,
                value: variable,
                group: translate('Process.Details.Modeler.Widgets.ElementAwareAutocomplete.Groups.Variables'),
            }))
            : [];

    const options: Record<string, { label: string; value: any; group: any }> = React.useMemo(() => {
        let result = [];

        const defaultOptions = [...services, ...utils];
        result = [...defaultOptions, ...result];

        if (context?.element) {
            const scope = BPMNHelperFunctions.getScope(context.element);
            const rootElement = BPMNHelperFunctions.getParentElement(context.element);

            if (rootElement) {
                if (rootElement.loopCharacteristics && rootElement.loopCharacteristics.elementVariable) {
                    const { elementVariable } = rootElement.loopCharacteristics;
                    const localVariables = [
                        {
                            value: `\${environment.variables.content.${elementVariable}}`,
                            label: `\${environment.variables.content.${elementVariable}}`,
                            group: translate('Process.Details.Modeler.Widgets.ElementAwareAutocomplete.Groups.Local'),
                        },
                        {
                            value: `#{${elementVariable}}`,
                            label: `#{${elementVariable}}`,
                            group: translate('Process.Details.Modeler.Widgets.ElementAwareAutocomplete.Groups.Local'),
                        },
                    ];
                    result = [...localVariables, ...result];
                }

                const outputs: any[] = getVariablesForScope(scope, rootElement).map((option) => ({
                    label: option.name,
                    value: option.name,
                    group: translate('Process.Details.Modeler.Widgets.ElementAwareAutocomplete.Groups.Outputs'),
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

                result = [...dollarOutputs, ...hashOutputs, ...result];
            }

            const assignVariablesElements = context.modeler
                ?.get('elementRegistry')
                .filter((element: BPMNElement) => is(element, 'bpmn:Task'))
                .filter(
                    (element: BPMNElement) =>
                        element.businessObject.actionId === 'variables.assign' ||
                        element.businessObject.actionId === 'variables.assignList',
                );

            const variables = assignVariablesElements
                .map((assignVariablesElement) => {
                    const inputOutput: CamundaInputOutputElement = assignVariablesElement.businessObject
                        ?.extensionElements?.values[0] as CamundaInputOutputElement;
                    if (inputOutput) {
                        const [variable] = inputOutput.inputParameters.filter(
                            (inputParameter) => inputParameter.name === 'variable',
                        );
                        return {
                            label: variable.value,
                            value: variable.value,
                            group: translate(
                                'Process.Details.Modeler.Widgets.ElementAwareAutocomplete.Groups.Variables',
                            ),
                        };
                    }
                    return undefined;
                })
                .concat(attendedProcessVariables)
                .filter((variable) => variable !== undefined);

            const dollarVariables = variables.map((option) => ({
                ...option,
                label: `\${environment.variables.${option.value}}`,
                value: `\${environment.variables.${option.value}}`,
            }));
            const hashVariables = variables.map((option) => ({
                ...option,
                label: `#{${option.value}}`,
                value: `#{${option.value}}`,
            }));

            result = [...dollarVariables, ...hashVariables, ...result];
        }

        return result.reduce((previousValue, currentValue) => {
            const newPrev = previousValue;
            newPrev[currentValue.value] = currentValue;
            return newPrev;
        }, {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [context?.element]);

    const optionValues = React.useMemo(
        () => ({
            'ui:options': Object.values(options).map((option) => option.value),
        }),
        [options],
    );

    return (
        <AutocompleteWidget
            {...props}
            value={props.value}
            groupBy={(option) => options[option].group}
            options={optionValues}
        />
    );
};

export default ElementAwareAutocompleteWidget;
