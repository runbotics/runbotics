import styled from 'styled-components';
import Paper from '@mui/material/Paper';
import { Typography } from '@mui/material';
import { DropzoneRootProps, getColor } from '.';

export const StyledPaper = styled(Paper)`
    min-height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    margin: 10px 0;
    border-color: ${(props: DropzoneRootProps) => getColor(props)};
    border-style: dashed;
    background-color: #fafafa;
    color: #bdbdbd;
    outline: none;
    transition: border 0.2s;
    cursor: pointer;
`;
export const StyledLabel = styled(Typography)(
    ({ theme }) => `    
    position: absolute;
    left: 0;
    top: 0;
    transform: translate(10px) scale(0.75);
    font-size: 1rem;
    transform-origin: top left;
    background-color: ${theme.palette.background.paper};
    padding: 0 4px;
`,
);
