import React from 'react';

// import {Box, Accordion, AccordionSummary, Typography, AccordionDetails} from '@mui/material';

import {Box} from '@mui/material';





const ProcessVariablesGlobal = () => {
    // const [isShown, setIsShown] = useState(false);
    // const [expanded, setExpanded] = React.useState<string | false>(false);
    const globalVariableList = ['global1', 'global2', 'global3'];

    // const handleCopy = (valueToCopy) => {
    //     setIsShown(true);
    //     navigator.clipboard.writeText(valueToCopy.toString());
    // }; 

    // const handleChange =
    // (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    //     setExpanded(isExpanded ? panel : false);
    // };
    
    const globalVariablesJSX = globalVariableList.map((variableValue) => (
     
        // <Accordion key={variableValue} id={variableValue} expanded={expanded === variableValue} onChange={handleChange(variableValue)}>
        //     <AccordionSummary
        //         expandIcon={<ExpandMoreIcon  />}
        //         aria-controls="panel1a-content"
                    
        //     >
        //         <Typography>{variableValue}
        //             <PositionedSnackbar open={isShown}
        //                 buttonText="Copy" message="Copied to clipboard" handleCopy={handleCopy(variableValue)} />
        //         </Typography>
        //     </AccordionSummary>
        //     <AccordionDetails>
        //         <Typography>
        //     Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
        //     malesuada lacus ex, sit amet blandit leo lobortis eget.
        //         </Typography>
        //     </AccordionDetails>
        // </Accordion>
  
        <h2 key={variableValue}>{variableValue}</h2>
        
    ));


    return (
        <Box>
            {globalVariablesJSX}
        </Box>
    );
};

export default ProcessVariablesGlobal;
