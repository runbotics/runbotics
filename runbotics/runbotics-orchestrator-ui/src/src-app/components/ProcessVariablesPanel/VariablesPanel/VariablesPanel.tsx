import React, { FC, useState } from 'react';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
    Box, Typography, Chip, Grid, Divider, IconButton
} from '@mui/material';

import { useTheme } from '@mui/material/styles';


import useProcessVariables from '#src-app/hooks/useProcessVariables';
import { translate } from '#src-app/hooks/useTranslations';

import VariableCopyMenu from '../VariableCopyMenu';
import { GridContainer, GridTag, GridVariable
} from './VariablesPanel.styles';

export enum VariableTag {
    VARIABLE = 'VariableTag',
    ACTION_OUTPUT = 'ActionOutputTag',
}

interface MenuProps {
    menuId: string,
    anchorElement?: HTMLElement
}

const VariablesPanel = () => {
    const theme = useTheme();
    const { globalVariables, inputActionVariables, outputActionVariables, attendedVariables } = useProcessVariables();

    const [openMenuId, setOpenMenuId] = useState<MenuProps>(null);

    const getTagBgColor = (tag: VariableTag) => {
        if (tag === VariableTag.VARIABLE) {
            return theme.palette.tag.variable;
        } 
        return theme.palette.tag.action;
         
    };
    
    const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, name: string) => {
        setOpenMenuId({menuId: name, anchorElement: event.currentTarget});
    };

    const handleMenuClose = () => {
        setOpenMenuId(null);
    };

    const VariableRow: FC<{name: string, tag: VariableTag}> = ({ name, tag }) => (
        <Box key={name}>
            <GridContainer container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
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
                    {openMenuId?.menuId === name ?
                        <VariableCopyMenu 
                            key={openMenuId?.menuId}
                            anchorElement={openMenuId?.anchorElement} 
                            handleMenuClose={handleMenuClose} 
                            menuId={openMenuId?.menuId} 
                            tag={tag}/>
                        : null}
                </Grid>
            </GridContainer>
            <Divider />
        </Box>);
        
    const variables = [...globalVariables, ...attendedVariables, ...inputActionVariables];

    variables.map(variable => (
        <VariableRow key={variable.name} name={variable.name} tag={VariableTag.VARIABLE}/>
    ));

    outputActionVariables.map(variable => (
        <VariableRow key={variable.name} name={variable.name} tag={VariableTag.ACTION_OUTPUT}/>
    ));

    const allProcessVariables = [...globalVariables, ...inputActionVariables, ...outputActionVariables, ...attendedVariables];

    if (allProcessVariables.length === 0) {
        return (
            <Typography sx={{display: 'flex', justifyContent: 'center', paddingTop: '2rem'}}>
                {translate('Process.Modeler.VariablesPanel.Empty.Message')}
            </Typography>);
    }

    return (
        <Box>
            {variables.map(variable => (
                <VariableRow key={variable.name} name={variable.name} tag={VariableTag.VARIABLE}/>
            ))}

            {outputActionVariables.map(variable => (
                <VariableRow key={variable.name} name={variable.name} tag={VariableTag.ACTION_OUTPUT}/>
            ))}
        </Box>
    );
};

export default VariablesPanel;
