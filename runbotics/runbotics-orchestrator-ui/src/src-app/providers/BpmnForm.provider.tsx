import React, { FC, useEffect, useState } from 'react';

import { Box, Typography } from '@mui/material';
import BpmnModelerType from 'bpmn-js/lib/Modeler';
import { IProcess } from 'runbotics-common';

import extractNestedSchemaKeys from '#src-app/components/utils/extractNestedSchemaKeys';
import If from '#src-app/components/utils/If';
import { CommandStackInfo } from '#src-app/store/slices/Process';
import { BPMNElement } from '#src-app/views/process/ProcessBuildView/Modeler/BPMN';
import { IBpmnAction } from '#src-app/views/process/ProcessBuildView/Modeler/ConfigureActionPanel/Actions/types';

export interface BpmnFormContext {
    element?: BPMNElement;
    modeler?: BpmnModelerType;
    action?: IBpmnAction;
    passedInVariables?: string[];
    setAction?: (action: IBpmnAction) => void;
    commandStack: CommandStackInfo;
}

const BpmnFormContext = React.createContext<BpmnFormContext>(null);
export const useBpmnFormContext = () => {
    const context = React.useContext<BpmnFormContext>(BpmnFormContext);
    return context;
};

interface BpmnFormProviderProps {
    element?: BPMNElement;
    modeler?: BpmnModelerType;
    process?: IProcess;
    commandStack: CommandStackInfo;
}

const BpmnFormProvider: FC<BpmnFormProviderProps> = ({ modeler, element, children, process, commandStack }) => {
    const [action, setAction] = useState<IBpmnAction>(null);
    const [passedInVariables, setPassedInVariables] = useState<string[]>([]);
    useEffect(() => {
        if (process && process.isAttended && process.executionInfo) 
        { setPassedInVariables(extractNestedSchemaKeys(JSON.parse(process.executionInfo).schema) ?? []); }
        
    }, [process]);

    return (
        <If
            condition={Boolean(element)}
            else={
                <Box pt={4}>
                    <Typography color="gray" align="center">
                        No element selected
                    </Typography>
                </Box>
            }
        >
            <BpmnFormContext.Provider value={{ modeler, element, action, setAction, passedInVariables, commandStack }}>
                {children}
            </BpmnFormContext.Provider>
        </If>
    );
};

export default BpmnFormProvider;
