import React, { useEffect, useState, VFC } from 'react';
import { TextField, TextFieldProps, IconButton } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

export type SearchBarProps = TextFieldProps & {
    onSearchPhraseChange: (value: string) => void;
};

const ActionSearch: VFC<SearchBarProps> = ({ onSearchPhraseChange, ...other }) => {
    const [value, setValue] = useState('');

    const clear = () => setValue('');

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        setValue(event.target.value);
    };

    useEffect(() => {
        onSearchPhraseChange(value);
    }, [value]);

    return (
        <TextField
            {...other}
            value={value}
            onChange={handleChange}
            size="small"
            sx={{ m: 1 }}
            InputProps={{
                endAdornment: (
                    <IconButton sx={{ visibility: value ? 'visible' : 'hidden' }} onClick={clear}>
                        <ClearIcon />
                    </IconButton>
                ),
                sx: { pr: '4px' },
            }}
        />
    );
};

export default ActionSearch;
