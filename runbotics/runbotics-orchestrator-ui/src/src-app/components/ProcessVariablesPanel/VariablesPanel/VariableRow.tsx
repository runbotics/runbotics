import React from 'react';

import MoreVertIcon from '@mui/icons-material/MoreVert';

import { Box, Grid, Chip, Divider, IconButton } from '@mui/material';

import { translate } from '#src-app/hooks/useTranslations';

import VariableCopyMenu from '../VariableCopyMenu';
import { VariableTag, MenuProps } from './VariablesPanel';
import { GridContainer, GridTag, GridVariable } from './VariablesPanel.styles';

interface VariableRowProps {
    name: string;
    tag: VariableTag;
    getTagBgColor: (tag: VariableTag) => string;
    handleMenuClick: (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        name: string
    ) => void;
    handleMenuClose: () => void;
    openMenuId: MenuProps;
}

const VariableRow = ({
    name,
    tag,
    getTagBgColor,
    handleMenuClick,
    handleMenuClose,
    openMenuId,
}: VariableRowProps) => (
    <Box key={name}>
        <GridContainer
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        >
            <GridVariable item xs={5}>
                {name}
            </GridVariable>
            <GridTag item xs={5}>
                <Chip
                    label={translate(
                        `Process.Modeler.VariablesPanel.${tag}`
                    ).toUpperCase()}
                    sx={{
                        bgcolor: getTagBgColor(tag),
                        color: 'black',
                        letterSpacing: 1.1,
                    }}
                    size="medium"
                />
            </GridTag>
            <Grid item xs={2}>
                <IconButton
                    size="medium"
                    onClick={(e) => handleMenuClick(e, name)}
                >
                    <MoreVertIcon />
                </IconButton>
                {openMenuId?.menuId === name ? (
                    <VariableCopyMenu
                        key={openMenuId.menuId}
                        anchorElement={openMenuId.anchorElement}
                        handleMenuClose={handleMenuClose}
                        menuId={openMenuId.menuId}
                        tag={tag}
                    />
                ) : null}
            </Grid>
        </GridContainer>
        <Divider />
    </Box>
);

export default VariableRow;
