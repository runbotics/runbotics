import React, { FC, useState } from 'react';

import { Box, Typography } from '@mui/material';

import { useTheme } from '@mui/material/styles';

import useProcessVariables from '#src-app/hooks/useProcessVariables';
import { translate } from '#src-app/hooks/useTranslations';

import {
    VariableTag,
    VariablePanelContextMenuState,
} from './ProcessVariablesPanel.types';
import VariableRow from './VariableRow/VariableRow';

const VariablesPanel: FC = () => {
    const theme = useTheme();
    const {
        globalVariables,
        inputActionVariables,
        outputActionVariables,
        attendedVariables,
    } = useProcessVariables();

    const [variableMenu, setVariableMenu] =
        useState<VariablePanelContextMenuState>(null);

    const getTagBgColor = (tag: VariableTag): string => {
        if (tag === VariableTag.VARIABLE) {
            return theme.palette.tag.variable;
        }
        return theme.palette.tag.action;
    };

    const handleMenuClick = (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        name: string
    ) => {
        setVariableMenu({
            variableName: name,
            anchorElement: event.currentTarget,
        });
    };

    const handleMenuClose = () => {
        setVariableMenu(null);
    };

    const variables = [
        ...globalVariables,
        ...attendedVariables,
        ...inputActionVariables,
    ];

    const allProcessVariables = [
        ...globalVariables,
        ...inputActionVariables,
        ...outputActionVariables,
        ...attendedVariables,
    ];

    if (allProcessVariables.length === 0) {
        return (
            <Typography
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    paddingTop: '2rem',
                }}
            >
                {translate('Process.Modeler.VariablesPanel.Empty.Message')}
            </Typography>
        );
    }

    return (
        <Box>
            {variables.map((variable) => (
                <VariableRow
                    key={variable.name}
                    name={variable.name}
                    tag={VariableTag.VARIABLE}
                    getTagBgColor={getTagBgColor}
                    handleMenuClick={handleMenuClick}
                    handleMenuClose={handleMenuClose}
                    menu={variableMenu}
                />
            ))}
            {outputActionVariables.map((variable) => (
                <VariableRow
                    key={variable.name}
                    name={variable.name}
                    tag={VariableTag.ACTION_OUTPUT}
                    getTagBgColor={getTagBgColor}
                    handleMenuClick={handleMenuClick}
                    handleMenuClose={handleMenuClose}
                    menu={variableMenu}
                />
            ))}
        </Box>
    );
};

export default VariablesPanel;
