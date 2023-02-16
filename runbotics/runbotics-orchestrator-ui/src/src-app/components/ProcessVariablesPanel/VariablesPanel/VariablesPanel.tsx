import React from 'react';

import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import {
    Box, Typography, Chip, Grid, IconButton, Divider
} from '@mui/material';

import { useTheme } from '@mui/material/styles';
import { useSnackbar } from 'notistack';


import { GridContainer, GridTag, GridVariable } from './VariablesPanel.styles';

import useProcessVariables from '#src-app/hooks/useProcessVariables';
import { translate } from '#src-app/hooks/useTranslations';



enum VariableTag {
    Variable = 'VariableTag',
    ActionOutput = 'ActionOutputTag',
}

const VariablesPanel = () => {
    const theme = useTheme();
    const { globalVariables, actionVariables, attendedVariables } = useProcessVariables();
    const { enqueueSnackbar } = useSnackbar();

    const actionOutputs = actionVariables.filter(variable => variable.name === 'variableName');
    const actionInputs = actionVariables.filter(variable => variable.name === 'variable');

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
        if (tag === VariableTag.Variable) {
            return theme.palette.tag.variable;
        } 
        return theme.palette.tag.action;
         
    };

    const getJSXForVariable = (name: string, tag: VariableTag) => (
        <Box>
            <GridContainer container key={name} rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <GridVariable item xs={5}>
                    {name}
                </GridVariable>
                <GridTag item xs={5}>
                    <Chip
                        label={translate(`Process.Modeler.VariablesPanel.${tag}`).toUpperCase()}
                        sx={{ bgcolor: getTagBgColor(tag), color: 'black', letterSpacing: 1.1}}
                        size="medium"/>
                </GridTag>
                <Grid item xs={2}>
                    <IconButton size="medium" onClick={() => handleCopy(name)}>
                        <ContentCopyRoundedIcon/>
                    </IconButton>
                </Grid>
            </GridContainer>
            <Divider />
        </Box>);

    const getGlobalVariablesUsedInProcessJSX = globalVariables?.map(variable => getJSXForVariable(variable.name, VariableTag.Variable));

    const getAttendedVariablesJSX = attendedVariables?.map(variable => getJSXForVariable(variable.name, VariableTag.Variable));

    const getActionVariablesJSX = actionInputs?.map(variable => getJSXForVariable(variable.value, VariableTag.Variable));

    const getActionOutputVariablesJSX = actionOutputs?.map(variable => getJSXForVariable(variable.value, VariableTag.ActionOutput));


    return (
        <Box>
            {getGlobalVariablesUsedInProcessJSX}
            {getActionVariablesJSX}
            {getAttendedVariablesJSX}
            {getActionOutputVariablesJSX}
        </Box>
    );
};

export default VariablesPanel;
