/* eslint-disable complexity */
/* eslint-disable max-lines-per-function */
import React, {useState} from 'react';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Box, Typography, Chip} from '@mui/material';

import useProcessVariables from '#src-app/hooks/useProcessVariables';

import PositionedSnackbar from '../PositionedSnackbar';

const ProcessVariablesGlobal = () => {
    const {taggedGlobalVariables, taggedActionVariables, taggedAttendedVariables} = useProcessVariables();

    const [expanded, setExpanded] = useState(taggedActionVariables[0].name);

    const globalVariables = [...taggedActionVariables, ...taggedGlobalVariables, ...taggedAttendedVariables];

    const handleCopy = (valueToCopy: String) => {
        navigator.clipboard.writeText(valueToCopy.toString());
    }; 


    const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
    };
    
    const globalVariablesJSX = globalVariables.map((variableValue) => (
        <Accordion key={variableValue.name} expanded={expanded === variableValue.name}  onChange={handleChange(variableValue.name)}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon  />}
                aria-controls={variableValue.name}
                id={variableValue.name}
            >
                <Typography>{variableValue.name}<Chip label={variableValue.tag} color="primary" size="small"></Chip></Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget.
                    <Box display="flex" justifyContent={'right'}>
                        <PositionedSnackbar
                            buttonText="Copy" message="Copied to clipboard" handleCopy={() => handleCopy(variableValue.name)} />
                    </Box>
                </Typography>
            </AccordionDetails>
        </Accordion>   
    ));


    return (
        <h1>
            {/* <ProcessVariablesTabs tabs={tabs}/> */}
            {globalVariablesJSX}
            {/* {myGlobalVariablesJSX} */}
        </h1>
    );
};

export default ProcessVariablesGlobal;





