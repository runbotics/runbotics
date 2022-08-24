import React from 'react';
import styled from 'styled-components';
import type { FC } from 'react';
import clsx from 'clsx';
import { Grid, Typography } from '@mui/material';
import { IProcessInstance } from 'runbotics-common';
import useTranslations from 'src/hooks/useTranslations';

const PREFIX = 'Header';

const classes = {
    root: `${PREFIX}-root`,
};

const StyledGrid = styled(Grid)(() => ({
    [`&.${classes.root}`]: {},
}));

interface HeaderProps {
    className?: string;
    processInstance: IProcessInstance;
}

const Header: FC<HeaderProps> = ({ className, processInstance, ...rest }) => {
    const { translate } = useTranslations();
    return (
        <StyledGrid
            container
            spacing={3}
            justifyContent="space-between"
            className={clsx(classes.root, className)}
            {...rest}
        >
            <Grid item>
                <Typography variant="h3" color="textPrimary">
                    {
                        translate(
                            'Process.ProcessInstanceView.Header.Title',
                            {
                                id: processInstance.id,
                                name: processInstance.process.name,
                            },
                        )
                    }
                </Typography>
            </Grid>
        </StyledGrid>
    );
};

export default Header;
