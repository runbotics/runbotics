import { Typography } from '@mui/material';
import {
    TreeItem,
    treeItemClasses,
} from '@mui/x-tree-view/TreeItem';
import styled from 'styled-components';

import { StyledTreeItemRootProps } from './CustomTreeItem.types';

export const StyledTreeItemRoot = styled(TreeItem)<StyledTreeItemRootProps>`
  color: ${({ theme }) => theme.palette.text.primary};
  & .${treeItemClasses.content} {
    transition: all 250ms ease;
    text-overflow: ellipsis;
    white-space: nowrap;
    border-radius: 100px;
    &:hover {
      background-color: ${({ theme }) => theme.palette.action.hover};
    }
    &.Mui-focused,
    &.Mui-selected,
    &.Mui-selected.Mui-focused {
      background-color: transparent;
      color: ${({ theme }) => theme.palette.primary.main};
      &:hover {
        background-color: ${({ $haschildren, theme }) =>
        $haschildren ? theme.palette.action.hover : 'transparent'};
      }
    }
  }
`;

export const StyledCollectionName = styled(Typography)`
  max-width: 25ch;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-weight: inherit;
`;
