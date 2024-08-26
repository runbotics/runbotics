import { Select } from '@mui/material';
import styled from 'styled-components';

export const Box = styled.div(({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'left',
    width: '70%',
    gap: '5px',
}));

export const StyledSelect = styled(Select)(({
    marginBottom: '20px'
}));
