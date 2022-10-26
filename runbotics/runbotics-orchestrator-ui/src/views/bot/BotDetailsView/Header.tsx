import type { FC } from 'react';
import styled from 'styled-components';
import { Grid, Typography } from '@mui/material';
import { useSelector } from 'src/store';
import { useRouter } from 'next/router';

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
