import {
    IconButton, InputBase, List, ListItem, Paper,
} from '@mui/material';
import styled from 'styled-components';

export const StyledList = styled(List)`
  padding: 0;
`;

export const StyledListItem = styled(ListItem)`
    display: flex;
    gap: 1rem;
`;

export const DeleteButton = styled(IconButton)`
    && {
        border-radius: 50%;
    }
`;

export const SearchListItem = styled(ListItem)`
    padding-top: 0;
`;

export const AddListItem = styled(ListItem)`
    && {
        display: flex;
        justify-content: center;
    }
`;

export const AddButton = styled(IconButton)`
    && {
        width: 30%;
        border-radius: 1rem;
    }
`;

export const SearchWrapper = styled(Paper)`
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0.3125rem 0.625rem;
    gap: 0.625rem;
`;

export const SearchInput = styled(InputBase)`
    width: 100%;
`;
