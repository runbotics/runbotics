/* eslint-disable complexity */
/* eslint-disable max-lines-per-function */
import React, { useState } from 'react';


import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
    Box, Accordion, AccordionSummary, AccordionDetails, Typography, Chip
} from '@mui/material';

import useProcessVariables from '#src-app/hooks/useProcessVariables';
import { lightTheme } from '#src-app/theme/light';

import PositionedSnackbar from '../PositionedSnackbar';

enum VariableTag {
    Global = 'GLOBAL',
    InputOutput = 'INPUT/OUTPUT',
    ActionAssigned = 'ACTION ASSIGNED',
}


const VariablesPanel = () => {
    const {globalVariables, actionVariables, attendedVariables} = useProcessVariables();
    const [expanded, setExpanded] = useState<string | null>(null);

    const tagVariable = (name, tag, color) => ({
        name: `#{${name}}`,
        tag: tag,
        color: color
    });

    if ([...globalVariables, ...actionVariables, ...attendedVariables].length === 0) {
        console.log('taaak');
        return <Typography display="flex" justifyContent="center" paddingTop="2rem">No variables used in this process yet</Typography>;
    }

    const taggedGlobalVariables = globalVariables.map(variable => tagVariable(variable.name, VariableTag.Global, lightTheme.palette.tag.dark));

    const taggedActionVariables = actionVariables.map(variable => tagVariable(variable.value, VariableTag.ActionAssigned, lightTheme.palette.tag.main));

    const taggedAttendedVariables = attendedVariables.map(variable => tagVariable(variable.name, VariableTag.InputOutput, lightTheme.palette.tag.light));

    const allProcessVariables = [...taggedGlobalVariables, ...taggedActionVariables, ...taggedAttendedVariables];

    console.log(allProcessVariables);


    const handleCopy = (valueToCopy: String) => {
        navigator.clipboard.writeText(valueToCopy.toString());
    };

    const handleClick = (variableName) => {
        variableName === expanded ? setExpanded(null) : setExpanded(variableName);
    };

    const allProcessVariablesJSX = allProcessVariables?.map((processVariable) => (
        <Accordion TransitionProps={{unmountOnExit: true}}
            key={processVariable.name}
            expanded={expanded === processVariable.name}
            onChange={() => handleClick(processVariable.name)}
        >
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={processVariable.name}
                id={processVariable.name}
              
            >
                <Typography variant='h5'sx={{ width: '60%'}} >
                    {processVariable.name}
                </Typography>
                <Typography ><Chip
                    label={processVariable.tag}
                    sx={{ bgcolor: processVariable.color, color: 'white' }}
                    size="small"
                ></Chip></Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Typography>
                    
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Suspendisse malesuada lacus ex, sit amet blandit leo
                    lobortis eget.
                    
                    <Box display="flex" justifyContent={'right'}>
                        <PositionedSnackbar
                            buttonText="Copy"
                            message="Copied to clipboard"
                            handleCopy={() => handleCopy(processVariable.name)}
                        />
                    </Box>
                </Typography>
            </AccordionDetails>
        </Accordion>
    ));

    return (
        <Box>
            {allProcessVariablesJSX}
        </Box>
    );
};

export default VariablesPanel;
