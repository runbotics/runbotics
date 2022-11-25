import React, { VFC } from 'react';

import { Box, Paper } from '@mui/material';
import styled from 'styled-components';

import BotProcessRunner from 'src/components/BotProcessRunner';

import { useSelector } from '../../../store';
const PREFIX = 'RunProcessInstantly';

const classes = {
    root: `${PREFIX}-root`,
    btn: `${PREFIX}-btn`,
};

const StyledBox = styled(Box)(({ theme }) => ({
    [`& .${classes.root}`]: {},

    [`& .${classes.btn}`]: {
        paddingLeft: theme.spacing(8),
        paddingRight: theme.spacing(8),
        color: 'white',
    },
}));

interface Props {
    onRunClick?: () => void;
}

const RunProcessInstantly: VFC<Props> = ({ onRunClick }) => {
    const { process } = useSelector((state) => state.process.draft);

    return (
        <StyledBox>
            <Paper elevation={1}>
                <Box padding="0.5rem">
                    <BotProcessRunner
                        process={process}
                        color="primary"
                        className={classes.btn}
                        variant="contained"
                        onRunClick={onRunClick}
                    />
                </Box>
            </Paper>
        </StyledBox>
    );
};

export default RunProcessInstantly;
