import React, { FC } from 'react';

import {
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormLabel,
    Popover,
    Typography,
    Box,
} from '@mui/material';
import styled from 'styled-components';

import { translate } from '#src-app/hooks/useTranslations';

import { Filters, GroupProperties } from './ActionListPanel.types';

interface FilterModalProps {
    anchorElement: Element | null;
    activeFilters: Filters;
    filterOptions: GroupProperties[];
    setFilters: (value: React.SetStateAction<Filters>) => void;
    onClose: () => void;
}

const StyledContainer = styled(Box)`
    max-width: 180px;
    max-height: 400px;
    padding: 15px;
`;

const FilterModal: FC<FilterModalProps> = ({ anchorElement, activeFilters, filterOptions, setFilters, onClose }) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { checked, name } = event.target;
        if (checked) 
        { setFilters((prevState: Filters) => ({ ...prevState, groupNames: [...prevState.groupNames, name] })); }
        else 
        { setFilters((prevState: Filters) => ({ ...prevState, groupNames: prevState.groupNames.filter((filter) => filter !== name) })); }
        
    };

    const clearFilters = () => {
        setFilters((prevState: Filters) => ({ ...prevState, groupNames: [] }));
    };

    return (
        <Popover
            open={Boolean(anchorElement)}
            onClose={onClose}
            anchorEl={anchorElement}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            sx={{ mt: 1 }}
        >
            <StyledContainer>
                <FormControl component="fieldset" variant="standard">
                    <FormLabel component="legend" sx={{ fontWeight: 500 }}>
                        {translate('Process.Details.Modeler.ActionListPanel.Filter.Label')}
                    </FormLabel>
                    <FormGroup>
                        {filterOptions.map(({ key, label }) => (
                            <FormControlLabel
                                sx={{ marginY: '2px', width: '100%' }}
                                key={key}
                                control={
                                    <Checkbox
                                        name={label}
                                        checked={Boolean(activeFilters.groupNames.includes(label))}
                                        onChange={handleChange}
                                    />
                                }
                                label={label}
                            />
                        ))}
                    </FormGroup>
                </FormControl>
                <Button sx={{ marginInline: 'auto' }} onClick={clearFilters} fullWidth>
                    <Typography variant="button">
                        {translate('Process.Details.Modeler.ActionListPanel.Filter.Clear')}
                    </Typography>
                </Button>
            </StyledContainer>
        </Popover>
    );
};

export default FilterModal;
