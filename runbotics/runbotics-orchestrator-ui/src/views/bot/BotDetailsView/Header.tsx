import type { FC } from 'react';
import React from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { Grid, Typography } from '@mui/material';
import { BotParams } from 'src/utils/types/BotParams';
import { useSelector } from 'src/store';

const PREFIX = 'Header';

const classes = {
    root: `${PREFIX}-root`,
};

const StyledGrid = styled(Grid)(() => ({
    [`&.${classes.root}`]: {},
}));

const Header: FC = () => {
    const { id } = useParams<BotParams>();
    const botsMap = useSelector((state) => state.bot.bots.byId);

    return (
        <StyledGrid container spacing={3} justifyContent="space-between" className={classes.root}>
            <Grid item>
                <Typography variant="h3" color="textPrimary">
                    {botsMap[id]?.installationId}
                </Typography>
            </Grid>
        </StyledGrid>
    );
};

export default Header;
