import React, { useState, FC, ChangeEvent, KeyboardEvent } from 'react';

import SearchIcon from '@mui/icons-material/Search';
import { Box, Card, Checkbox, Chip, Divider, FormControlLabel, Input } from '@mui/material';
import clsx from 'clsx';
import styled from 'styled-components';

import MultiSelect from './MultiSelect';

const PREFIX = 'Filter';

const classes = {
    root: `${PREFIX}-root`,
    searchInput: `${PREFIX}-searchInput`,
    chip: `${PREFIX}-chip`,
};

const StyledCard = styled(Card)(({ theme }) => ({
    [`&.${classes.root}`]: {},

    [`& .${classes.searchInput}`]: {
        marginLeft: theme.spacing(2),
    },

    [`& .${classes.chip}`]: {
        margin: theme.spacing(1),
    },
}));

interface FilterProps {
    className?: string;
}

const selectOptions = [
    {
        label: 'Type',
        options: ['Freelance', 'Full Time', 'Part Time', 'Internship'],
    },
    {
        label: 'Level',
        options: ['Novice', 'Expert'],
    },
    {
        label: 'Location',
        options: ['Africa', 'Asia', 'Australia', 'Europe', 'North America', 'South America'],
    },
    {
        label: 'Roles',
        options: ['Android', 'Web Developer', 'iOS'],
    },
];

const Filter: FC<FilterProps> = ({ className, ...rest }) => {
    const [inputValue, setInputValue] = useState<string>('');
    const [chips, setChips] = useState<string[]>([
        'Freelance',
        'Full Time',
        'Novice',
        'Europe',
        'Android',
        'Web Developer',
    ]);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
        event.persist();
        setInputValue(event.target.value);
    };

    const handleInputKeyup = (event: KeyboardEvent<HTMLInputElement>): void => {
        event.persist();

        if (event.keyCode === 13 && inputValue)
        { if (!chips.includes(inputValue)) {
            setChips((prevChips) => [...prevChips, inputValue]);
            setInputValue('');
        } }
    };

    const handleChipDelete = (chip: string): void => {
        setChips((prevChips) => prevChips.filter((prevChip) => chip !== prevChip));
    };

    const handleMultiSelectChange = (value: string[]): void => {
        setChips(value);
    };

    return (
        <StyledCard className={clsx(classes.root, className)} {...rest}>
            <Box p={2} display="flex" alignItems="center">
                <SearchIcon />
                <Input
                    disableUnderline
                    fullWidth
                    className={classes.searchInput}
                    onChange={handleInputChange}
                    onKeyUp={handleInputKeyup}
                    placeholder="Enter a keyword"
                    value={inputValue}
                />
            </Box>
            <Divider />
            <Box p={2} display="flex" alignItems="center" flexWrap="wrap">
                {chips.map((chip) => (
                    <Chip className={classes.chip} key={chip} label={chip} onDelete={() => handleChipDelete(chip)} />
                ))}
            </Box>
            <Divider />
            <Box display="flex" alignItems="center" flexWrap="wrap" p={1}>
                {selectOptions.map((option) => (
                    <MultiSelect
                        key={option.label}
                        label={option.label}
                        onChange={handleMultiSelectChange}
                        options={option.options}
                        value={chips}
                    />
                ))}
                <Box flexGrow={1} />
                <FormControlLabel control={<Checkbox defaultChecked />} label="In network" />
            </Box>
        </StyledCard>
    );
};

export default Filter;
