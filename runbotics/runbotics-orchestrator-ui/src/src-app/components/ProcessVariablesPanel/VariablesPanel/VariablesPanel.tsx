import React, { useState } from 'react';



import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
    Box, Accordion, AccordionSummary, AccordionDetails, Typography, Chip
} from '@mui/material';

import useProcessVariables from '#src-app/hooks/useProcessVariables';
import { translate } from '#src-app/hooks/useTranslations';
import { lightTheme } from '#src-app/theme/light';

import PositionedSnackbar from '../PositionedSnackbar';

enum VariableTag {
    Global = 'GlobalTag',
    InputOutput = 'InputOutputTag',
    ActionAssigned = 'ActionAssignedTag',
}

interface Taggable {
    name: string,
    tag: VariableTag,
    color: string
}

const VariablesPanel = () => {
    const {globalVariables, actionVariables, attendedVariables} = useProcessVariables();
    const [expanded, setExpanded] = useState<string | null>(null);

    const tagVariable = ({name, tag, color}: Taggable) => ({
        name: `#{${name}}`,
        tag: tag,
        color: color
    });

    if ([...globalVariables, ...actionVariables, ...attendedVariables].length === 0) {
        return <Typography display="flex" justifyContent="center" paddingTop="2rem">No variables used in this process yet</Typography>;
    }

    const taggedGlobalVariables = globalVariables?.map(variable => tagVariable({name: variable.name, tag: VariableTag.Global, color: lightTheme.palette.tag.dark})).filter(variable => variable!== undefined);

    const taggedActionVariables = actionVariables?.map(variable => tagVariable({name: variable.value, tag: VariableTag.ActionAssigned, color: lightTheme.palette.tag.main})).filter(variable => variable!== undefined);

    const taggedAttendedVariables = attendedVariables?.map(variable => tagVariable({name: variable.name, tag: VariableTag.InputOutput, color: lightTheme.palette.tag.light})).filter(variable => variable!== undefined);

    const allProcessVariables = [...taggedGlobalVariables, ...taggedActionVariables, ...taggedAttendedVariables];

    const getTranslatedTag = (tag: VariableTag): string => translate(`Process.Modeler.VariablesPanel.${tag}`);

    const handleCopy = (valueToCopy: String) => {
        navigator.clipboard.writeText(valueToCopy.toString());
    };

    const handleClick = (variableName) => {
        variableName === expanded ? setExpanded(null) : setExpanded(variableName);
    };

    const allProcessVariablesJSX = allProcessVariables?.map((processVariable: Taggable) => (
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
                    label={getTranslatedTag(processVariable.tag).toUpperCase()}
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
