import { Chip, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

export const FilterContainer = styled(Stack)(({ theme }) => ({
    marginTop: theme.spacing(2),
    flexWrap: 'wrap',
}));

export const FilterChip = styled(Chip)(({ theme }) => ({
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1),
}));
