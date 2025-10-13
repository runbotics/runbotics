import { Avatar, Chip, Card } from '@mui/material';
import { orange } from '@mui/material/colors';
import { styled } from '@mui/material/styles';

export const StyledCard = styled(Card)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: theme.spacing(1, 2),
    gap: theme.spacing(2),
    boxShadow: theme.shadows[2],
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
        backgroundColor: theme.palette.grey[100],
        boxShadow: theme.shadows[4],
        transform: 'translateY(-1px)',
    },
}));

export const StyledAvatar = styled(Avatar)(() => ({
    width: 56,
    height: 56,
    backgroundColor: orange[50],
}));

export const CategoryChip = styled(Chip)(({ theme }) => ({
    marginRight: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5),
}));
