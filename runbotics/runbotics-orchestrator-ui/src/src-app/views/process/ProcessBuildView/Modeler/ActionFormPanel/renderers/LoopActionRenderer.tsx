import React, { FC } from 'react';

import { Box, Grid } from '@mui/material';

import { IFormData } from '#src-app/Actions/types';
import { useModelerContext } from '#src-app/hooks/useModelerContext';
import { useDispatch, useSelector } from '#src-app/store';

import { processActions } from '#src-app/store/slices/Process';

import { BPMNHelper, BpmnSubProcess } from '../../helpers/elementParameters';
import ActionLabelForm from '../ActionLabelForm';
import customWidgets from '../widgets';
import JSONSchemaFormRenderer from './JSONSchemaFormRenderer';

interface LoopParameters {
    input: {
        iterations: string;
        loopType: LoopType;
        elementVariable: string;
        collection: string;
    };
    output: Record<string, unknown>;
}

enum LoopType {
    REPEAT = 'Repeat',
    COLLECTION = 'Collection'
}

const LoopActionRenderer: FC = () => {
    const dispatch = useDispatch();
    const { modeler } = useModelerContext();
    const { selectedElement, selectedAction } = useSelector(
        state => state.process.modeler
    );

    const isLoopElement = (element: unknown): element is BpmnSubProcess =>
        (element as BpmnSubProcess)?.businessObject?.loopCharacteristics !==
        undefined;

    const CUSTOM_FORMATS = { variableName: /(^\$.+)|(^#.+)/ };

    const defaultFormData = React.useMemo(() => {
        if (!isLoopElement(selectedElement)) return null;

        const defaultParameters: LoopParameters = {
            input: {
                iterations: '',
                loopType: LoopType.REPEAT,
                elementVariable: '',
                collection: ''
            },
            output: {}
        };

        if (
            parseInt(
                selectedElement.businessObject.loopCharacteristics
                    ?.loopCardinality?.body
            )
        ) {
            defaultParameters.input.iterations =
                selectedElement.businessObject.loopCharacteristics.loopCardinality.body;
            defaultParameters.input.loopType = LoopType.REPEAT;
        } else {
            for (const [key] of Object.entries(
                selectedAction.form.formData.input
            )) {
                defaultParameters.input[key] =
                    selectedElement.businessObject.loopCharacteristics[key];
            }

            defaultParameters.input.loopType = LoopType.COLLECTION;
        }

        return defaultParameters;
    }, [selectedAction, selectedElement]);

    const formatLoopBody = (collectionName: string) => {
        if (collectionName.startsWith('#')) {
            return `#{length(${collectionName.slice(2, -1)})}`;
        }
        return `${collectionName.slice(0, -1)}.length}`;
    };

    const handleSubmit = (formState: IFormData) => {
        if (!isLoopElement(selectedElement)) return;

        const bpmnHelper = BPMNHelper.from(modeler);
        const { loopType } = formState.formData.input;
        const { loopCharacteristics } = selectedElement.businessObject;
        const { loopCardinality, collection } = loopCharacteristics;

        for (const [key, value] of Object.entries(formState.formData.input)) {
            loopCharacteristics[key] = value;
        }

        if (loopType === LoopType.REPEAT) {
            loopCardinality.body = formState.formData.input.iterations;
        }

        if (loopType === LoopType.COLLECTION && collection) {
            loopCardinality.body = formatLoopBody(collection);
        }
        
        bpmnHelper.updateBusinessObject(selectedElement);
        dispatch(processActions.addAppliedAction(selectedElement.id));
    };

    const updateLabel = (label: string) => {
        const bpmnHelper = BPMNHelper.from(modeler);
        const newElement = selectedElement;
        newElement.businessObject.label = label;
        bpmnHelper.updateBusinessObject(newElement);
    };

    return (
        <>
            <Grid item xs={12}>
                <Box px={2} pt={1}>
                    <ActionLabelForm onSubmit={updateLabel} />
                </Box>
            </Grid>
            <JSONSchemaFormRenderer
                id={selectedElement.id}
                schema={selectedAction.form.schema}
                uiSchema={selectedAction.form.uiSchema}
                formData={defaultFormData}
                onSubmit={handleSubmit}
                widgets={customWidgets}
                customFormats={CUSTOM_FORMATS}
            />
        </>
    );
};

export default LoopActionRenderer;
