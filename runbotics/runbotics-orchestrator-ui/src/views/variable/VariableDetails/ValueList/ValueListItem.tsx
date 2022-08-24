import { TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import React, { FunctionComponent } from 'react';
import If from 'src/components/utils/If';
import useTranslations from 'src/hooks/useTranslations';
import { VariableValue } from '../VariableDetails.types';
import { DeleteButton, StyledListItem } from './ValueList.styles';

interface ValueListItemProps {
    listItem: VariableValue;
    onDelete: (id: string) => void;
    onChange: (newListItem: VariableValue) => void;
    readOnly?: boolean;
}

const ValueListItem: FunctionComponent<ValueListItemProps> = ({
    listItem: { id, value }, onDelete, onChange, readOnly,
}) => {
    const { translate } = useTranslations();

    return (
        <StyledListItem key={id}>
            <TextField
                fullWidth
                variant="outlined"
                value={value}
                onChange={(event) => onChange({ id, value: event.target.value })}
                disabled={readOnly}
            />
            <If condition={!readOnly}>
                <DeleteButton
                    aria-label={translate('Variables.Details.ValueList.Delete.AriaLabel')}
                    size="medium"
                    onClick={() => onDelete(id)}
                >
                    <DeleteIcon fontSize="small" />
                </DeleteButton>
            </If>
        </StyledListItem>
    );
};

export default ValueListItem;
