import { Button, DialogContent } from '@mui/material';
import Image from 'next/image';
import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    padding: 20px;
    gap: 20px;
`;

export const Header = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 14px;
`;

export const ActionsContainer = styled.div<{ $rowCount: number }>(({ $rowCount }) => `
    display: grid;
    grid-template-columns: repeat(${$rowCount}, 1fr);
    flex-wrap: wrap;
    gap: 20px;
`);

export const ActionsColumns = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

export const ActionBox = styled.div(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    border: `2px solid ${theme.palette.grey[400]}`,
    borderRadius: '6px',
    padding: '8px',
    minWidth: '300px',
    gap: '10px',
}));

export const ActionBoxHeader = styled.div(({ theme }) => ({
    paddingBottom: '5px',
    borderBottom: `2px solid ${theme.palette.grey[400]}`
}));

export const ActionBoxContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

export const DeleteDialogContent = styled(DialogContent)`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

export const AddDialogContent = styled(DialogContent)`
    margin: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

export const StyledButton = styled(Button)`
    width: 80px;
`;

export const StyledImage = styled(Image)`
    filter: brightness(0) saturate(100%);
`;
