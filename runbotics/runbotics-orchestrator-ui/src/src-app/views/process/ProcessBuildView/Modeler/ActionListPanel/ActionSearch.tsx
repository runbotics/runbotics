import React, { useEffect, useState, VFC } from 'react';

import ClearIcon from '@mui/icons-material/Clear';
import { TextField, TextFieldProps, IconButton } from '@mui/material';

export type SearchBarProps = TextFieldProps & {
    onSearchPhraseChange: (value: string) => void;
};

const ActionSearch: VFC<SearchBarProps> = ({
    onSearchPhraseChange,
    ...other
}) => {
    const [value, setValue] = useState('');

    const clear = () => setValue('');

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (
        event
    ) => {
        setValue(event.target.value);
    };

    useEffect(() => {
        onSearchPhraseChange(value);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    return (
        <TextField
            {...other}
            value={value}
            onChange={handleChange}
            size="small"
            InputProps={{
                endAdornment: (
                    <IconButton
                        sx={{ visibility: value ? 'visible' : 'hidden' }}
                        onClick={clear}
                    >
                        <ClearIcon />
                    </IconButton>
                ),
                sx: { pr: '4px' },
            }}
        />
    );
};

export default ActionSearch;
