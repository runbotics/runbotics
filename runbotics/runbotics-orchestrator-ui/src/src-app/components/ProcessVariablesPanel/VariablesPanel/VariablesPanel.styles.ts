import { Grid } from '@mui/material';
import styled from 'styled-components';

export const GridVariable = styled(Grid)`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  z-index: 10;
  &:hover {
    overflow: visible;
    white-space: normal;
    word-break: break-all;
  }
`;

export const GridContainer = styled(Grid)`
  padding: 0.8rem;
  align-items: center;
  display: flex-start;
`;

export const GridTag = styled(Grid)`
  display: flex;
  justify-content: end
`;
