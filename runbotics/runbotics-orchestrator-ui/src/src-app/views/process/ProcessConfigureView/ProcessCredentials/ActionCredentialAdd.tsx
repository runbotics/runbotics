import { FunctionComponent } from 'react';

import AddIcon from '@mui/icons-material/Add';

import { AddTile } from './ActionCredential.styles';

interface ActionCredentialAddProps {
    handleClick: () => void;
}

const ActionCredentialAdd: FunctionComponent<ActionCredentialAddProps> = ({
    handleClick
}) => (
    <AddTile onClick={handleClick}>
        <AddIcon sx={{ fontSize: '30px' }}/>
    </AddTile>
);

export default ActionCredentialAdd;
