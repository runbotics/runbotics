import { FC, useEffect, useState } from 'react';

import { ContentCopyOutlined, InfoOutlined } from '@mui/icons-material';
import { Button, Tooltip } from '@mui/material';

import { differenceInDays } from 'date-fns';

import { useSnackbar } from 'notistack';

import useTranslations from '#src-app/hooks/useTranslations';
import { useDispatch, useSelector } from '#src-app/store';
import { getServiceToken } from '#src-app/store/slices/Webhook/Webhook.thunks';
import {
    ExpirationDate,
    GenerateTokenButton,
    Token,
    TokenContainer,
    TokenInfo,
} from '#src-app/views/webhooks/WebhooksView/WebhookHeader/GenerateToken/GenerateToken.styles';
import { WebhookHeaderTokenContainer } from '#src-app/views/webhooks/WebhooksView/WebhookHeader/WebhookHeader.styles';

const GenerateToken: FC = () => {
    const {translate} = useTranslations();
    const dispatch = useDispatch();
    const tenantState = useSelector((state) => state.auth.user.tenant);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [isTokenVisible, setIsTokenVisible] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const [daysToExpire, setDaysToExpire] = useState<number | null>(null);
    const {enqueueSnackbar} = useSnackbar();

    const onGenerateClick = async () => {
        try {
            const serviceTokenData = await dispatch(getServiceToken()).unwrap();
            setToken(serviceTokenData.token);
            setIsTokenVisible(true);
            setIsButtonDisabled(true);
        } catch (e) {
            console.log(e);
        }
    };
    
    const copyToken = async () => {
        if(token) {
            await navigator.clipboard.writeText(token);
            enqueueSnackbar(
                'Token copied',
                {
                    autoHideDuration: 3000,
                }
            );
        }
    };

    useEffect(() => {
        if (tenantState?.serviceTokenExpDate) {
            const expDate = new Date(tenantState.serviceTokenExpDate);
            const now = Date.now();
            setDaysToExpire(differenceInDays(expDate, now));
        }
    }, [tenantState?.serviceTokenExpDate]);

    return (
        <WebhookHeaderTokenContainer>
            <GenerateTokenButton>
                <Button
                    variant={'outlined'}
                    disabled={isButtonDisabled}
                    onClick={onGenerateClick}
                >
                    {translate('Webhooks.List.RegisterWebhook')}
                </Button>
            </GenerateTokenButton>
            <TokenContainer>
                {daysToExpire && (
                    <TokenInfo>
                        <ExpirationDate>
                            {translate('Webhooks.List.TokenExpirationInDays', {days: daysToExpire})}
                        </ExpirationDate>
                        {isTokenVisible && <ContentCopyOutlined onClick={copyToken} />}
                    </TokenInfo>
                )}
                {isTokenVisible && <Token>{token}</Token>}
            </TokenContainer>
            {!isTokenVisible && <Tooltip title={translate('Webhooks.List.TokenAuthorizationInfo')} ><InfoOutlined /></Tooltip>}
        </WebhookHeaderTokenContainer>
    );
};

export default GenerateToken;
