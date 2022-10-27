import React, { FC } from 'react';

import { Button, Grid, SvgIcon, Typography } from '@mui/material';
import clsx from 'clsx';
import { PlusCircle as PlusIcon } from 'react-feather';

import { FeatureKey } from 'runbotics-common';
import styled from 'styled-components';

import If from 'src/components/utils/If';
import useFeatureKey from 'src/hooks/useFeatureKey';
import useTranslations from 'src/hooks/useTranslations';
import { useDispatch } from 'src/store';
import { setShowEditModal } from 'src/store/slices/Action/Action.thunks';
import { defaultValue } from 'src/types/model/action.model';

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
}

const Header: FC<HeaderProps> = ({ className, ...rest }) => {
    const dispatch = useDispatch();
    const { translate } = useTranslations();
    const hasActionAddAccess = useFeatureKey([FeatureKey.EXTERNAL_ACTION_ADD]);

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
                    {translate('Action.List.Header.Title')}
                </Typography>
            </Grid>
            <If condition={hasActionAddAccess}>
                <Grid item>
                    <Button
                        color="secondary"
                        variant="contained"
                        startIcon={
                            <SvgIcon fontSize="small">
                                <PlusIcon />
                            </SvgIcon>
                        }
                        onClick={() => {
                            dispatch(setShowEditModal({ show: true, action: { ...defaultValue } }));
                        }}
                    >
                        {translate('Action.List.Header.AddAction')}
                    </Button>
                </Grid>
            </If>
        </StyledGrid>
    );
};

export default Header;
