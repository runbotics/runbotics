import { LoadingButton } from '@mui/lab';
import { Button } from '@mui/material';
import styled from 'styled-components';

const BUTTON_HEIGHT = 40;

export const NormalDialogButton = styled(Button)`
    height: ${BUTTON_HEIGHT}px;
`;

export const DialogLoadingButton = styled(LoadingButton)`
    height: ${BUTTON_HEIGHT}px;
`;
