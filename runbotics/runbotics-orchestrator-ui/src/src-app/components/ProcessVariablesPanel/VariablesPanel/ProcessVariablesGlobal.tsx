import React from 'react';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {Box, Accordion, AccordionSummary, Typography, AccordionDetails} from '@mui/material';
// import {Box} from '@mui/material';


import PositionedSnackbar from '../PositionedSnackbar';





const ProcessVariablesGlobal = () => {
    const [expanded, setExpanded] = React.useState<string | false>(false);
    const globalVariableList = ['global1', 'global2', 'global3'];

    const handleCopy = (valueToCopy: String) => {
        navigator.clipboard.writeText(valueToCopy.toString());
    }; 

    const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
    };
    
    const globalVariablesJSX = globalVariableList.map((variableValue) => (
     
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
  
        // <h2 key={variableValue}>{variableValue}</h2>
        
    ));


    return (
        <Box>
            {globalVariablesJSX}
        </Box>
    );
};

export default ProcessVariablesGlobal;
