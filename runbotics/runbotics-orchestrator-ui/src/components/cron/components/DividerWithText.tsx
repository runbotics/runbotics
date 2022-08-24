import React from 'react';
import styled from 'styled-components';

const PREFIX = 'DividerWithText';

const classes = {
    container: `${PREFIX}-container`,
    border: `${PREFIX}-border`,
    content: `${PREFIX}-content`,
};

const Root = styled.div(({ theme }) => ({
    [`&.${classes.container}`]: {
        display: 'flex',
        alignItems: 'center',
    },

    [`& .${classes.border}`]: {
        borderBottom: '2px solid lightgray',
        width: '100%',
    },

    [`& .${classes.content}`]: {
        paddingTop: theme.spacing(0.5),
        paddingBottom: theme.spacing(0.5),
        paddingRight: theme.spacing(2),
        paddingLeft: theme.spacing(2),
        fontWeight: 500,
        fontSize: 22,
        color: 'lightgray',
    },
}));

const DividerWithText = ({ children }: any) => (
        <Root className={classes.container}>
            <div className={classes.border} />
            <span className={classes.content}>{children}</span>
            <div className={classes.border} />
        </Root>
);
export default DividerWithText;
