import {
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormLabel,
    Popover,
    Typography,
} from '@mui/material';
import Box from '@mui/material/Box';
import React, { FC, useMemo } from 'react';
import { translate } from 'src/hooks/useTranslations';
import styled from 'styled-components';
import { FilterModalState } from './ActionListPanel.types';

interface FilterModalProps {
    filterModalState: FilterModalState;
    setFilterModalState: (value: React.SetStateAction<FilterModalState>) => void;
    filterOptions: [string, { label: string; items: any }][];
}

const StyledContainer = styled(Box)`
    max-width: 180px;
    max-height: 400px;
    padding: 15px;
`;

const FilterModal: FC<FilterModalProps> = ({ filterModalState, setFilterModalState, filterOptions }) => {
    const isModalOpen = useMemo(() => Boolean(filterModalState.anchorElement), [filterModalState.anchorElement]);
    const handleClose = () => {
        setFilterModalState((prevState: FilterModalState) => {
            return { ...prevState, anchorElement: null };
        });
    };
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { checked, name } = event.target;
        if (checked) {
            setFilterModalState((prevState: FilterModalState) => {
                return { ...prevState, filters: [...prevState.filters, name] };
            });
        } else {
            setFilterModalState((prevState: FilterModalState) => {
                return { ...prevState, filters: prevState.filters.filter((filter) => filter !== name) };
            });
        }
    };

    const clearFilters = () => {
        setFilterModalState((prevState: FilterModalState) => {
            return { ...prevState, filters: [] };
        });
    };

    return (
        <Popover
            open={isModalOpen}
            anchorEl={filterModalState.anchorElement}
            onClose={handleClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
        >
            <StyledContainer>
                <FormControl component="fieldset" variant="standard">
                    <FormLabel component="legend" sx={{ fontWeight: 500 }}>
                        {translate('Process.Details.Modeler.ActionListPanel.Filter.Label')}
                    </FormLabel>
                    <FormGroup>
                        {filterOptions.map(([key, { label }]) => (
                            <FormControlLabel
                                sx={{ marginY: '2px', width: '100%' }}
                                key={key}
                                control={
                                    <Checkbox
                                        name={label}
                                        checked={Boolean(filterModalState.filters.includes(label))}
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
