import { Grid } from '@mui/material';
import styled from 'styled-components';

export const GridVariable = styled(Grid)`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  &:hover {
    overflow: visible;
    white-space: normal;
    word-break: break-all;
  }
`;

export const GridContainer = styled(Grid)(({ theme }) => `
  padding: ${theme.spacing(2)};
  align-items: center;
  display: flex-start;
`);

export const GridTag = styled(Grid)`
  display: flex;
  justify-content: end
`;
