import { FunctionComponent, useState } from 'react';

import { Dialog, DialogActions, DialogTitle, MenuItem, Typography } from '@mui/material';

import If from '#src-app/components/utils/If';

import { Content, StyledButton, StyledSelect } from './ProcessCredentials.styles';


interface ProcessCredentialsAddDialogProps {
    isOpen: boolean;
    handleClose: () => void;
}

export const ProcessCredentialsAddDialog: FunctionComponent<ProcessCredentialsAddDialogProps> = ({
    isOpen, handleClose
}) => {
    const [isCollectionPicked, setIsCollectionPicked] = useState(false);

    return (
        <If condition={isOpen}>
            <Dialog open fullWidth>
                <DialogTitle>
                    <Typography variant='h5'>
                        Add new credential for action
                    </Typography>
                </DialogTitle>
                <Content>
                    <StyledSelect

                    >
                        <MenuItem>1</MenuItem>
                        <MenuItem>2</MenuItem>
                    </StyledSelect>
                    <StyledSelect disabled={isCollectionPicked}>
                        <MenuItem>1</MenuItem>
                        <MenuItem>2</MenuItem>
                    </StyledSelect>
                </Content>
                <DialogActions>
                    <StyledButton onClick={handleClose}>Close</StyledButton>
                    <StyledButton variant='contained'>Add</StyledButton>
                </DialogActions>
            </Dialog>
        </If>
    );
};
