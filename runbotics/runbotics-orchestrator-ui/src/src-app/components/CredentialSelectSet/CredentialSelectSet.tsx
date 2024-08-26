import { FunctionComponent } from 'react';

import { MenuItem, Typography } from '@mui/material';
import { UserDTO } from 'runbotics-common';

import { Box, StyledSelect } from './CredentialSelectSet.styles';

interface CredentialSelectSetProps {
    authors: UserDTO[];
    credentials: unknown;
}


const CredentialSelectSet: FunctionComponent<CredentialSelectSetProps> = ({
    authors, credentials
}) => {
    const x = 1;

    return (
        <Box>
            <Typography>Collection author</Typography>
            <StyledSelect>
                <MenuItem>
                x
                </MenuItem>
            </StyledSelect>
            <Typography>Collection name</Typography>
            <StyledSelect>
                <MenuItem>
                x
                </MenuItem>
            </StyledSelect>
            <Typography>Credential name</Typography>
            <StyledSelect>
                <MenuItem>
                x
                </MenuItem>
            </StyledSelect>
        </Box>
    );
};

export default CredentialSelectSet;
