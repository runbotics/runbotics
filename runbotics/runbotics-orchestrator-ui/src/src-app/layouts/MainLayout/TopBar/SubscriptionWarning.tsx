import { Typography, Box } from '@mui/material';
import { differenceInDays, parseISO } from 'date-fns';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import useTranslations from '#src-app/hooks/useTranslations';
import { authSelector } from '#src-app/store/slices/Auth';

const RedText = styled.span`
    color: ${({ theme }) => theme.palette.error.main};
    font-weight: bold;
`;

const SubscriptionWarning = () => {
    const { translate } = useTranslations();
    const { user } = useSelector(authSelector);

    if (!user?.tenant?.subscriptionEnd) {
        return null;
    }

    const subscriptionEnd = parseISO(user.tenant.subscriptionEnd);
    const now = new Date();
    const diffDays = differenceInDays(subscriptionEnd, now);

    if (diffDays >= 14) {
        return null;
    }

    return (
        <Box mr={2}>
            <Typography variant="body2">
                <RedText>{translate('Tenant.Plugins.License.ExpireIn', { days: diffDays })}</RedText>
            </Typography>
        </Box>
    );
};

export default SubscriptionWarning;
