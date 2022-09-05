import _ from 'lodash';
import { is } from 'bpmn-js/lib/util/ModelUtil';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import { IBpmnAction } from './ConfigureActionPanel/Actions/types';
import {
    BPMNElement, BPMNHelper, findPreviousElements, getInputParameters, getOutputParameters,
} from './BPMN';
import { translate } from 'src/hooks/useTranslations';
import { ActionToBPMNElement } from './ConfigureActionPanel/ActionToBPMNElement';
import { ParameterDestination } from './extensions/custom/CustomPalette';
import { ProcessState } from 'src/store/slices/Process';

const DEFAULT_OPTIONS = [
    { value: '${environment.services.run()}', name: translate('Process.Details.Options.ByValue.ContentScript') },
    { value: '${environment.services.desktop()}', name: translate('Process.Details.Options.ByValue.Desktop') },
    {
        value: '${environment.services.backgroundScript()}',
        name: translate('Process.Details.Options.ByValue.BackgroundPage'),
    },
    {
        value: '${environment.services.runHidden()}',
        name: translate('Process.Details.Options.ByValue.HiddenContentScript'),
    },
];

const byValue = DEFAULT_OPTIONS.reduce((accumulator, obj) => {
    accumulator[obj.value] = obj.name;
    return accumulator;
}, {});

export const getExtensionScriptLabel = (implementation: string) => byValue[implementation];
interface ApplyModelerElementProps {
    element: BPMNElement;
    modeler: BpmnModeler;
    action: IBpmnAction;
    additionalParameters?: {
        input: { [key: string]: any };
        output: { [key: string]: any };
        disabled?: boolean;
        runFromHere?: boolean;
    };
}

const disablePreviousElements = (modeler: BpmnModeler, element: BPMNElement, runFromHere: boolean) => {
    if (runFromHere) {
        const found = findPreviousElements(element);
        const serviceTasks = found.filter(() => is(element, 'bpmn:ServiceTask'));
        const bpmnHelper = BPMNHelper.from(modeler);
        serviceTasks.forEach((serviceTask) => {
            const newServiceTask = serviceTask;
            newServiceTask.businessObject.disabled = true;
            bpmnHelper.updateBusinessObject(newServiceTask);
        });
    } else {
        const found = findPreviousElements(element);
        const serviceTasks = found.filter(() => is(element, 'bpmn:ServiceTask'));
        const bpmnHelper = BPMNHelper.from(modeler);
        serviceTasks.forEach((serviceTask) => {
            const newServiceTask = serviceTask;
            newServiceTask.businessObject.disabled = false;
            bpmnHelper.updateBusinessObject(newServiceTask);
        });
    }
};

export const applyModelerElement = ({ modeler, element, action, additionalParameters }: ApplyModelerElementProps) => {
    const bpmnHelper = BPMNHelper.from(modeler);
    const actionToBPMNElement: ActionToBPMNElement = ActionToBPMNElement.from(modeler);

    element.businessObject.disabled = additionalParameters?.disabled;
    if (additionalParameters?.runFromHere !== element.businessObject?.runFromHere) {
        disablePreviousElements(modeler, element, additionalParameters?.runFromHere);
    }
    element.businessObject.runFromHere = additionalParameters?.runFromHere;

    let data = {
        input: {
            ...getInputParameters(element),
            ...(additionalParameters?.input ?? []),
        },
        output: {
            ...(additionalParameters?.output ?? getOutputParameters(element)),
        },
    };

    const inputParams = actionToBPMNElement.formDataToParameters(
        ParameterDestination.Input,
        data.input,
        action ? action.form.schema : null,
    );
    if (inputParams.length > 0) {
        actionToBPMNElement.setInputParameters(element, inputParams);
    }

    if (additionalParameters?.output && action.output && action.output.assignVariables) {
        Object.entries(action.output.outputMethods).forEach((currentValue) => {
            const key = currentValue[0];
            const value = currentValue[1];
            const output = data.output[key];
            if (output) {
                Object.entries(data.output).forEach(([k, v]) => {
                    if (value === v) {
                        delete data.output[k];
                    }
                });

                data.output[output] = value;
            }

        });
    }

    if (Object.keys(data.output).length > 0) {
        const outputParams = actionToBPMNElement.formDataToParameters(
            ParameterDestination.Output,
            data.output,
            action ? action.form.schema : null,
        );
        actionToBPMNElement.setOutputParameters(element, outputParams);
    }
    bpmnHelper.updateBusinessObject(element);
};

export const isSaveDisabled = (ProcessModelerStore: ProcessState['modeler'], modeler: BpmnModeler) => {
    if (!modeler) return true;

    const { appliedActivities, commandStackIdx, isDirty: isModelerDirty } = ProcessModelerStore;
    const elementRegistry = modeler.get('elementRegistry');
    const modelerActivities = Object.keys(elementRegistry._elements).filter(
        (elm) => elm.split('_')[0] === 'Activity',
    );
    const isModelerInSync = _.isEqual(_.sortBy(modelerActivities), _.sortBy(appliedActivities));
    const isCommandStackAtBottom = commandStackIdx === -1;
    return isCommandStackAtBottom || !isModelerDirty || !isModelerInSync;
}