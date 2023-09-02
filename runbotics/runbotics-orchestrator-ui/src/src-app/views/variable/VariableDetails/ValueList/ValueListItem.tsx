import React, { FunctionComponent } from 'react';

import DeleteIcon from '@mui/icons-material/Delete';
import { TextField } from '@mui/material';

import If from '#src-app/components/utils/If';

import useTranslations from '#src-app/hooks/useTranslations';

import { DeleteButton, StyledListItem } from './ValueList.styles';
import { VariableValue } from '../VariableDetails.types';




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
