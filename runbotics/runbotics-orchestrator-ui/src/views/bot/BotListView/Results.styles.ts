import styled from 'styled-components';
import { Card } from '@mui/material';

const PREFIX = 'Results';

export const classes = {
    root: `${PREFIX}-root`,
    bulkOperations: `${PREFIX}-bulkOperations`,
    bulkActions: `${PREFIX}-bulkActions`,
    bulkAction: `${PREFIX}-bulkAction`,
    queryField: `${PREFIX}-queryField`,
    categoryField: `${PREFIX}-categoryField`,
    availabilityField: `${PREFIX}-availabilityField`,
    stockField: `${PREFIX}-stockField`,
    shippableField: `${PREFIX}-shippableField`,
    imageCell: `${PREFIX}-imageCell`,
    image: `${PREFIX}-image`,
    filterField: `${PREFIX}-filterField`,
};

export const StyledCard = styled(Card)(({ theme }) => ({
    [`&.${classes.root}`]: {
        display: 'flex',
        flexDirection: 'column',
    },

    [`& .${classes.bulkOperations}`]: {
        position: 'relative',
    },

    [`& .${classes.bulkActions}`]: {
        paddingLeft: 4,
        paddingRight: 4,
        marginTop: 6,
        position: 'absolute',
        width: '100%',
        zIndex: 2,
        backgroundColor: theme.palette.background.default,
    },

    [`& .${classes.bulkAction}`]: {
        marginLeft: theme.spacing(2),
    },

    [`& .${classes.queryField}`]: {
        width: 500,
    },

    [`& .${classes.categoryField}`]: {
        flexBasis: 200,
    },

    [`& .${classes.availabilityField}`]: {
        marginLeft: theme.spacing(2),
        flexBasis: 200,
    },

    [`& .${classes.stockField}`]: {
        marginLeft: theme.spacing(2),
    },

    [`& .${classes.shippableField}`]: {
        marginLeft: theme.spacing(2),
    },

    [`& .${classes.imageCell}`]: {
        fontSize: 0,
        width: 68,
        flexBasis: 68,
        flexGrow: 0,
        flexShrink: 0,
    },

    [`& .${classes.image}`]: {
        height: 68,
        width: 68,
    },

    [`& .${classes.filterField}`]: {
        width: '30%',
        alignSelf: 'end',
        margin: 10,
    },
}));
