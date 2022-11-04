import { Box } from '@mui/material';
import styled from 'styled-components';

const PREFIX = 'BotCollectionView';

export const classes = {
    root: `${PREFIX}-root`,
    cardsWrapper: `${PREFIX}-cardsWrapper`,
    title: `${PREFIX}-title`,
};

export const CollectionsRoot = styled.div(() => ({
    [`& .${classes.root}`]: {},

    [`& .${classes.cardsWrapper}`]: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
        gap: '1rem',
    },
}));

export const StyledBox = styled(Box)(({ theme }) => ({
    [`& .${classes.title}`]: {
        position: 'relative',
        '&:after': {
            position: 'absolute',
            bottom: -8,
            left: 0,
            content: '" "',
            height: 3,
            width: 48,
            backgroundColor: theme.palette.primary.main,
        },
        marginTop: 30,
        marginBottom: 30,
    },
}));
