import React from 'react';
import { useSelector } from 'src/store';
import { Prompt } from 'react-router-dom';

const LeavePromt = () => {
    const { isSaveDisabled } = useSelector((state) => state.process.modeler);
    return (
        <Prompt
            when={!isSaveDisabled}
            message={(location) =>
                !location.pathname.includes('build')
                    ? `You haven't save changes, are you sure u want to leave? All unsaved changes will be lost.`
                    : false
            }
        />
    );
};

export default LeavePromt;
