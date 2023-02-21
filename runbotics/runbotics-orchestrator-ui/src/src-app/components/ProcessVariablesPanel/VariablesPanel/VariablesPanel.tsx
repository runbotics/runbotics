import React, { useState } from 'react';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
    Box, Typography, Chip, Grid, Divider, IconButton
} from '@mui/material';

import { useTheme } from '@mui/material/styles';

import MenuCopy from '../MenuCopy';
import { GridContainer, GridTag, GridVariable
} from './VariablesPanel.styles';

import If from '#src-app/components/utils/If';
import useProcessVariables from '#src-app/hooks/useProcessVariables';
import { translate } from '#src-app/hooks/useTranslations';

export enum VariableTag {
    Variable = 'VariableTag',
    ActionOutput = 'ActionOutputTag',
}

const VariablesPanel = () => {
    const theme = useTheme();
    const { globalVariables, inputActionVariables, outputActionVariables, attendedVariables } = useProcessVariables();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [showMenu, setShowMenu] = useState(null);    
    
    const [menuId, setMenuId] = useState(false);

    const allProcessVariables = [...globalVariables, ...inputActionVariables, ...outputActionVariables, ...attendedVariables];

    if (allProcessVariables.length === 0) {
        return (
            <Typography sx={{display: 'flex', justifyContent: 'center', paddingTop: '2rem'}}>
                {translate('Process.Modeler.VariablesPanel.Empty.Message')}
            </Typography>);
    }

    const getTagBgColor = (tag: VariableTag) => {
        if (tag === VariableTag.Variable) {
            return theme.palette.tag.variable;
        } 
        return theme.palette.tag.action;
         
    };
    
    const handleMenuClick = (event, name) => {
        event.preventDefault();
        setAnchorEl(event.currentTarget);
        setShowMenu(true);
        setMenuId(name);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setMenuId(null);
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
                    <IconButton size="medium" onClick={(e) => handleMenuClick(e, name)}>
                        <MoreVertIcon/>
                    </IconButton>
                    <If condition={showMenu}>
                        <MenuCopy 
                            name={name} 
                            anchorEl={anchorEl} 
                            handleMenuClose={handleMenuClose} 
                            menuId={menuId} 
                            tag={tag}/>
                    </If>
                </Grid>
            </GridContainer>
            <Divider />
        </Box>);

    const getGlobalVariablesUsedInProcessJSX = globalVariables?.map(variable => getJSXForVariable(variable.name, VariableTag.Variable));

    const getAttendedVariablesJSX = attendedVariables?.map(variable => getJSXForVariable(variable.name, VariableTag.Variable));

    const getActionVariablesJSX = inputActionVariables?.map(variable => getJSXForVariable(variable.value, VariableTag.Variable));

    const getActionOutputVariablesJSX = outputActionVariables?.map(variable => getJSXForVariable(variable.value, VariableTag.ActionOutput));

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
