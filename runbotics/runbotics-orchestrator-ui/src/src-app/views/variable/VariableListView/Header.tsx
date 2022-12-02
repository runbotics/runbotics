import React, { FC } from 'react';

import { Button, Grid, SvgIcon, Typography } from '@mui/material';
import clsx from 'clsx';
import { PlusCircle as PlusIcon } from 'react-feather';

import { FeatureKey } from 'runbotics-common';
import styled from 'styled-components';

import If from '#src-app/components/utils/If';
import useFeatureKey from '#src-app/hooks/useFeatureKey';
import useTranslations from '#src-app/hooks/useTranslations';

const PREFIX = 'Header';

const classes = {
    root: `${PREFIX}-root`,
    action: `${PREFIX}-action`,
};

const StyledGrid = styled(Grid)(({ theme }) => ({
    [`&.${classes.root}`]: {},

    [`& .${classes.action}`]: {
        marginBottom: theme.spacing(1),
        '& + &': {
            marginLeft: theme.spacing(1),
        },
    },
}));

interface HeaderProps {
    className?: string;
    onVariableCreate: () => void;
}

const Header: FC<HeaderProps> = ({ className, onVariableCreate, ...rest }) => {
    const { translate } = useTranslations();
    const hasVariableAddAccess = useFeatureKey([FeatureKey.GLOBAL_VARIABLE_ADD]);

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
                    {translate('Variables.Header.Title')}
                </Typography>
            </Grid>
            <If condition={hasVariableAddAccess}>
                <Grid item>
                    <Button
                        color="secondary"
                        variant="contained"
                        startIcon={
                            <SvgIcon fontSize="small">
                                <PlusIcon />
                            </SvgIcon>
                        }
                        onClick={onVariableCreate}
                    >
                        {translate('Variables.Header.AddGlobalVariable')}
                    </Button>
                </Grid>
            </If>
        </StyledGrid>
    );
};

export default Header;
