import React from 'react';

import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import {
    Box, Typography, Chip, Grid, IconButton, Divider
} from '@mui/material';

import { useTheme } from '@mui/material/styles';
import { useSnackbar } from 'notistack';


import useProcessVariables from '#src-app/hooks/useProcessVariables';
import { translate } from '#src-app/hooks/useTranslations';


enum VariableTag {
    Global = 'GlobalTag',
    InputOutput = 'InputOutputTag',
    ActionAssigned = 'ActionAssignedTag',
}

interface Taggable {
    name: string,
    tag: VariableTag,
}


const VariablesPanel = () => {
    const theme = useTheme();
    const { globalVariables, actionVariables, attendedVariables } = useProcessVariables();
    const { enqueueSnackbar } = useSnackbar();


    const allProcessVariables = [...globalVariables, ...actionVariables, ...attendedVariables];

    if (allProcessVariables.length === 0) {
        return (
            <Typography sx={{display: 'flex', justifyContent: 'center', paddingTop: '2rem'}}>
                {translate('Process.Modeler.VariablesPanel.Empty.Message')}
            </Typography>);
    }


    const handleCopy = (variableName: string) => {
        try {
            navigator.clipboard.writeText(variableName);

            enqueueSnackbar(
                translate(
                    'Process.Modeler.VariablesPanel.Copy.Message.Success',
                ),
                { variant: 'success' },
            );
        } catch {
            enqueueSnackbar(
                translate(
                    'Process.Modeler.VariablesPanel.Copy.Message.Error'
                ),
                { variant: 'error' },
            );
        }
    };

    const getTagBgColor = (tag: VariableTag) => {
        if (tag === VariableTag.Global) {
            return theme.palette.tag.global;
        } else if (tag === VariableTag.ActionAssigned) {
            return theme.palette.tag.action;
        } 
        return theme.palette.tag.attended;
    };

    const getJSXForVariable = (({name, tag}: Taggable) => (
        <Box>
            <Grid container key={name} rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{padding: '.8rem', alignItems: 'center' }}>
                <Grid item xs={5} sx={{wordBreak: 'break-word'}}>
                    {name}
                </Grid>
                <Grid item xs={5} sx={{display: 'flex', justifyContent: 'end'}}>
                    <Chip
                        label={translate(`Process.Modeler.VariablesPanel.${tag}`).toUpperCase()}
                        sx={{ bgcolor: getTagBgColor(tag), color: 'white' }}
                        size="medium"/>
                </Grid>
                <Grid item xs={2}>
                    <IconButton size="medium" onClick={() => handleCopy(name)}>
                        <ContentCopyRoundedIcon/>
                    </IconButton>
                </Grid>
            
            </Grid>
            <Divider />
        </Box>));

    const getGlobalVariablesUsedInProcessJSX = globalVariables?.map(variable => getJSXForVariable({name: variable.name, tag: VariableTag.Global}));

    const getActionVariablesJSX = actionVariables?.map(variable => getJSXForVariable({name: variable.value, tag: VariableTag.ActionAssigned}));

    const getAttendedVariablesJSX = attendedVariables?.map(variable => getJSXForVariable({name: variable.name, tag: VariableTag.InputOutput}));

    return (
        <Box>
            {getGlobalVariablesUsedInProcessJSX}
            {getActionVariablesJSX}
            {getAttendedVariablesJSX}
        </Box>
    );
};

export default VariablesPanel;
