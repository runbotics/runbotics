import React, { FC } from 'react';

import { Grid, Typography } from '@mui/material';
import clsx from 'clsx';

import useTranslations from '#src-app/hooks/useTranslations';

import { StyledHeaderGrid, classesHeader } from './UsersBrowseView.styles';

interface HeaderProps {
    className?: string;
}

const Header: FC<HeaderProps> = ({ className, ...rest }) => {
    const { translate } = useTranslations();

    return (
        <StyledHeaderGrid
            container
            spacing={3}
            justifyContent="space-between"
            className={clsx(classesHeader.root, className)}
            {...rest}
        >
            <Grid item>
                <Typography variant="h3" color="textPrimary">
                    {translate('Users.Browse.Header.Title')}
                </Typography>
            </Grid>
        </StyledHeaderGrid>
    );
};

export default Header;
