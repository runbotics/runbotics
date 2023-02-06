/* eslint-disable complexity */
/* eslint-disable max-lines-per-function */
import React, { useState } from 'react';


import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Typography,
    Chip,
} from '@mui/material';
import {teal} from '@mui/material/colors';

import useProcessVariables, { VariableTag } from '#src-app/hooks/useProcessVariables';

import PositionedSnackbar from '../PositionedSnackbar';


const VariablesPanel = () => {
    const {
        taggedGlobalVariables,
        taggedActionVariables,
        taggedAttendedVariables,
    } = useProcessVariables();

    const [expanded, setExpanded] = useState<string | null>(null);

    const allProcessVariables = [
        ...taggedActionVariables,
        ...taggedGlobalVariables,
        ...taggedAttendedVariables,
    ];

    console.log('all', allProcessVariables);

    const handleCopy = (valueToCopy: String) => {
        navigator.clipboard.writeText(valueToCopy.toString());
    };

    const getTagColor = (tag: VariableTag) => {
        switch (tag) {
            case VariableTag.ActionAssigned:
                return teal[400];
            case VariableTag.InputOutput:
                return teal[700];
            default:
                return teal[900];
        }
    };

    const allProcessVariablesJSX = allProcessVariables?.map((variableValue) => (
        <Accordion
            key={variableValue.name}
            expanded={expanded === variableValue.name}
            onChange={() => setExpanded(variableValue.name)}
        >
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={variableValue.name}
                id={variableValue.name}
              
            >
                <Typography variant='h5'sx={{ width: '60%'}} >
                    {variableValue.name}
                </Typography>
                <Typography ><Chip
                    label={variableValue.tag}
                    sx={{ bgcolor: getTagColor(variableValue.tag), color: 'white' }}
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
                            handleCopy={() => handleCopy(variableValue.name)}
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
