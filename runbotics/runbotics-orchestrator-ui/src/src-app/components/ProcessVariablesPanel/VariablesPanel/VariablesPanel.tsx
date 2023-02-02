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

import useProcessVariables, { VariableTag } from '#src-app/hooks/useProcessVariables';

import PositionedSnackbar from '../PositionedSnackbar';

const VariablesPanel = () => {
    const {
        taggedGlobalVariables,
        taggedActionVariables,
        taggedAttendedVariables,
    } = useProcessVariables();

    const [expanded, setExpanded] = useState(taggedActionVariables[0].name);

    const allProcessVariables = [
        ...taggedActionVariables,
        ...taggedGlobalVariables,
        ...taggedAttendedVariables,
    ];

    const handleCopy = (valueToCopy: String) => {
        navigator.clipboard.writeText(valueToCopy.toString());
    };

    const handleChange =
        (panel: string) =>
            (event: React.SyntheticEvent, isExpanded: boolean) => {
                setExpanded(isExpanded ? panel : false);
            };

    const getTagColor = (tag: VariableTag) => {
        switch (tag) {
            case VariableTag.ActionAssigned:
                return 'chocolate';
            case VariableTag.InputOutput:
                return 'darkslateblue';
            default:
                return 'grey';
        }
    };

    const allProcessVariablesJSX = allProcessVariables.map((variableValue) => (
        <Accordion
            key={variableValue.name}
            expanded={expanded === variableValue.name}
            onChange={handleChange(variableValue.name)}
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
