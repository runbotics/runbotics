import { Typography } from '@mui/material';
import {
    TreeItem,
    treeItemClasses,
} from '@mui/x-tree-view/TreeItem';
import styled from 'styled-components';

import { StyledTreeItemRootProps } from './CustomTreeItem.types';

export const StyledTreeItemRoot = styled(TreeItem)<StyledTreeItemRootProps>`
  ${({ theme, $selectable, $haschildren }) => `
    color: ${$selectable ? theme.palette.text.primary : theme.palette.text.disabled};
    & .${treeItemClasses.content} {
      transition: all 250ms ease;
      text-overflow: ellipsis;
      white-space: nowrap;
      border-radius: 100px;
      &:hover {
        background-color: ${$selectable || $haschildren ? theme.palette.action.hover : 'transparent'};
      }
      &.Mui-focused,
      &.Mui-selected,
      &.Mui-selected.Mui-focused {
        background-color: transparent;
        color: ${$selectable ? theme.palette.primary.main : theme.palette.text.disabled};
        &:hover {
          background-color: ${$haschildren ? theme.palette.action.hover : 'transparent'};
        }
      }
    }
  `}
`;

export const StyledCollectionName = styled(Typography)`
  max-width: 25ch;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-weight: inherit;
`;
