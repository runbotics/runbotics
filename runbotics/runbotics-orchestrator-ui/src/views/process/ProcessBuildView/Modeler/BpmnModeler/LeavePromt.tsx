import React, { FC, useMemo } from 'react';
import { useSelector } from 'src/store';
import { isSaveDisabled } from '../utils';
import { Prompt } from 'react-router-dom';
import { useModelerContext } from 'src/providers/Modeler.provider';

const LeavePromt = () => {
    const { modeler } = useModelerContext();
    const ProcessModelerStore = useSelector((state) => state.process.modeler);

    return (
        <Prompt
            when={!isSaveDisabled(ProcessModelerStore, modeler)}
            message={(location) =>
                !location.pathname.includes('build')
                    ? `You haven't save changes, are you sure u want to leave? All unsaved changes will be lost.`
                    : false
            }
        />
    );
};

export default LeavePromt;
