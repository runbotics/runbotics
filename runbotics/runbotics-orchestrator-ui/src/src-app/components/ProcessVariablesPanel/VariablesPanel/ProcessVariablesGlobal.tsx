/* eslint-disable complexity */
/* eslint-disable max-lines-per-function */
import React from 'react';

import { getVariablesForScope } from '@bpmn-io/extract-process-variables';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {Box, Accordion, AccordionSummary, Typography, AccordionDetails} from '@mui/material';

import { is } from 'bpmn-js/lib/util/ModelUtil';

import { useModelerContext } from '#src-app/hooks/useModelerContext';
import useTranslations from '#src-app/hooks/useTranslations';
import { useSelector } from '#src-app/store';

import { globalVariableSelector } from '#src-app/store/slices/GlobalVariable';
import { currentProcessSelector } from '#src-app/store/slices/Process';

import { BPMNElement, CamundaInputOutputElement } from '#src-app/views/process/ProcessBuildView/Modeler/helpers/elementParameters';

import PositionedSnackbar from '../PositionedSnackbar';
import ProcessVariablesTabs from '../ProcessVariablesTabs';



const ProcessVariablesGlobal = () => {
    const [expanded, setExpanded] = React.useState<string | false>(false);
    const globalVariableL = ['global1', 'global2', 'global3'];
    const {selectedElement, passedInVariables }= useSelector(state => state.process.modeler);
    const { translate } = useTranslations();
    const tabs = ['Global', 'Local', 'Defined by process'];
    const { globalVariables } = useSelector(globalVariableSelector);
    const { executionInfo, isAttended } = useSelector(
        currentProcessSelector
    );


    // console.log('global', global);
    // console.log('selectedElement', selectedElement);
    // console.log('passedInVariables', passedInVariables);

    const context = useModelerContext();

    const handleCopy = (valueToCopy: String) => {
        navigator.clipboard.writeText(valueToCopy.toString());
    }; 

    

    const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
    };

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

    // console.log(extractOutputs);

    const reduceList = (list: any[]) =>
        list.reduce((previousValue, currentValue) => {
            const newPrev = previousValue;
            newPrev[currentValue.value] = currentValue;
            return newPrev;
        }, {});

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

            // if (!selectedElement) {
            //     return reduceList(result);
            // }

            // const scope = BPMNHelperFunctions.getScope(selectedElement);
            // const rootElement =
            //     BPMNHelperFunctions.getParentElement(selectedElement);

            // if (rootElement) {
            //     result = [...extractOutputs(scope, rootElement), ...result];
            // }

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

            const assignVariablesElements =
                context?.modeler
                    ?.get('elementRegistry')
                    .filter((element: BPMNElement) => is(element, 'bpmn:Task'))
                    .filter(
                        (element: BPMNElement) =>
                            element.businessObject.actionId ===
                                'variables.assign' ||
                            element.businessObject.actionId ===
                                'variables.assignList' ||
                            element.businessObject.actionId ===
                                'variables.assignGlobalVariable'
                    ) ?? [];

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
                .filter(variable => variable !== undefined)
                .flatMap(variable => variable);

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
            // result = [...dollarVariables, ...hashVariables, ...result];

            return reduceList(result);
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [selectedElement]);

    // console.log('options:', options);

    // const getGlobalVariables = (object) => {
    //     for (const [key, value] of Object.entries(object)) {
    //         key.includes('#') ? ({[key]: value}) : null;
    //     }
    // };


    const myGlobalVars = Object.fromEntries(Object.entries(options).filter(([key]) => key.includes('#')));
    console.log('my:', myGlobalVars);
    

    
    const globalVariablesJSX = globalVariableL.map((variableValue) => (
     
        <Accordion key={variableValue} id={variableValue} expanded={expanded === variableValue} onChange={handleChange(variableValue)}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon  />}
                aria-controls={variableValue}
            >
                <Typography>{variableValue}
                </Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget.
                    <Box display="flex" justifyContent={'right'}>
                        <PositionedSnackbar
                            buttonText="Copy" message="Copied to clipboard" handleCopy={() => handleCopy(variableValue)} />
                    </Box>
                </Typography>
            </AccordionDetails>
        </Accordion>   
    ));

    const myGlobalVariablesJSX = (obj) => {
        for (const variable in obj) {
            const {label, value} = obj[variable];
            console.log(label, value);

            return (
                <Accordion key={label} id={label} expanded={expanded === label} onChange={handleChange(label)}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon  />}
                        aria-controls={label}
                    >
                        <Typography>{label}
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                    malesuada lacus ex, sit amet blandit leo lobortis eget.
                            <Box display="flex" justifyContent={'right'}>
                                <PositionedSnackbar
                                    buttonText="Copy" message="Copied to clipboard" handleCopy={() => handleCopy(label)} />
                            </Box>
                        </Typography>
                    </AccordionDetails>
                </Accordion>   
            );
        }
    };

    myGlobalVariablesJSX(myGlobalVars);



    return (
        <Box>
            <ProcessVariablesTabs tabs={tabs}/>
            {/* {globalVariablesJSX} */}
            {myGlobalVariablesJSX(myGlobalVars)}
        </Box>
    );
};

export default ProcessVariablesGlobal;





