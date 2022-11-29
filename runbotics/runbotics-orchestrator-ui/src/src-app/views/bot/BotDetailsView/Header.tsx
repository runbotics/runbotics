import type { FC } from 'react';

import { Grid, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import styled from 'styled-components';

import { useSelector } from '#src-app/store';


const PREFIX = 'Header';

const classes = {
    root: `${PREFIX}-root`,
};

const StyledGrid = styled(Grid)(() => ({
    [`&.${classes.root}`]: {},
}));

const Header: FC = () => {
    const router = useRouter();
    const { id } = router.query;
    const botsMap = useSelector((state) => state.bot.bots.byId);

    return (
        <StyledGrid container spacing={3} justifyContent="space-between" className={classes.root}>
            <Grid item>
                <Typography variant="h3" color="textPrimary">
                    {botsMap[id as string]?.installationId}
                </Typography>
            </Grid>
        </StyledGrid>
    );
};

export default Header;
