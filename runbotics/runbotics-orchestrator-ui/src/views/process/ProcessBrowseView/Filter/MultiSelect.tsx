import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import type { FC, ChangeEvent } from 'react';
import { Button, Checkbox, FormControlLabel, Menu, MenuItem } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const PREFIX = 'MultiSelect';

const classes = {
    root: `${PREFIX}-root`,
    menuItem: `${PREFIX}-menuItem`,
    formControlLabel: `${PREFIX}-formControlLabel`,
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled.div(({ theme }) => ({
    [`& .${classes.root}`]: {},

    [`& .${classes.menuItem}`]: {
        padding: 0,
    },

    [`& .${classes.formControlLabel}`]: {
        padding: theme.spacing(0.5, 2),
        width: '100%',
        margin: 0,
    },
}));

interface MultiSelectProps {
    label: string;
    onChange?: (value: string[]) => void;
    options: any[];
    value: string[];
}

const MultiSelect: FC<MultiSelectProps> = ({ label, options, value, onChange }) => {
    const anchorRef = useRef<any>(null);
    const [openMenu, setOpenMenu] = useState<boolean>(false);

    const handleMenuOpen = (): void => {
        setOpenMenu(true);
    };

    const handleMenuClose = (): void => {
        setOpenMenu(false);
    };

    const handleOptionToggle = (event: ChangeEvent<HTMLInputElement>): void => {
        let newValue = [...value];

        if (event.target.checked) {
            newValue.push(event.target.value);
        } else {
            newValue = newValue.filter((item) => item !== event.target.value);
        }

        if (onChange) {
            onChange(newValue);
        }
    };

    return (
        <Root>
            <Button onClick={handleMenuOpen} ref={anchorRef}>
                {label}
                <ArrowDropDownIcon />
            </Button>
            <Menu
                anchorEl={anchorRef.current}
                elevation={1}
                onClose={handleMenuClose}
                open={openMenu}
                PaperProps={{ style: { width: 250 } }}
            >
                {options.map((option) => (
                    <MenuItem className={classes.menuItem} key={option}>
                        <FormControlLabel
                            className={classes.formControlLabel}
                            control={
                                <Checkbox
                                    checked={value.indexOf(option) > -1}
                                    onChange={handleOptionToggle}
                                    value={option}
                                />
                            }
                            label={option}
                        />
                    </MenuItem>
                ))}
            </Menu>
        </Root>
    );
};

export default MultiSelect;
