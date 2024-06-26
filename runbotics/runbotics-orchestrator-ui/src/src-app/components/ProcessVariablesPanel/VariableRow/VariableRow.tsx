import React, { FC } from 'react';

import MoreVertIcon from '@mui/icons-material/MoreVert';

import { Box, Grid, Chip, Divider, IconButton } from '@mui/material';

import { translate } from '#src-app/hooks/useTranslations';

import { VariableRowProps } from '../ProcessVariablesPanel.types';
import VariableMenu from '../VariableMenu/VariableMenu';
import { GridContainer, GridTag, GridVariable } from '../VariablesPanel.styles';

const VariableRow: FC<VariableRowProps> = ({
    name,
    tag,
    getTagBgColor,
    handleMenuClick,
    handleMenuClose,
    menu,
}: VariableRowProps) => (
    <Box>
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
                    // @ts-ignore
                    label={translate(`Process.Modeler.VariablesPanel.Tag.${tag}`)
                        .toUpperCase()}
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
                {menu?.variableName === name ? (
                    <VariableMenu
                        anchorElement={menu?.anchorElement}
                        handleMenuClose={handleMenuClose}
                        menuId={menu?.variableName}
                        tag={tag}
                    />
                ) : null}
            </Grid>
        </GridContainer>
        <Divider />
    </Box>
);

export default VariableRow;
