import { useEffect, useState, FC } from 'react';

import { Container } from '@mui/material';
import { useRouter } from 'next/router';
import styled from 'styled-components';

import Loader from '#src-app/components/Loader';
import Page from '#src-app/components/pages/Page';
import useTranslations from '#src-app/hooks/useTranslations';
import { useDispatch } from '#src-app/store';
import { botActions } from '#src-app/store/slices/Bot';

import Header from './Header';
import Results from './Results';

const PREFIX = 'BotListView';

const classes = {
    root: `${PREFIX}-root`,
};

const StyledPage = styled(Page)(({ theme }) => ({
    [`&.${classes.root}`]: {
        backgroundColor: theme.palette.background.default,
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(4),
    },
}));

const BotDetailsView: FC = () => {
    const router = useRouter();
    const { id } = router.query;
    const dispatch = useDispatch();
    const { translate } = useTranslations();

    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        if (!id) return;

        const botId = Number(id);

        if (Number.isNaN(botId)) {
            router.replace('/404');
            return;
        }

        async function checkBotAccess() {
            try {
                setIsLoading(true);
                await dispatch(botActions.getById({ resourceId: botId })).unwrap();
                setIsError(false);
            } catch (err) {
                setIsError(true);
                router.replace('/404');
            } finally {
                setIsLoading(false);
            }
        }

        checkBotAccess();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    if (isLoading || !id) {
        return (
            <StyledPage className={classes.root} title={translate('Bot.Details.Meta.Title')}>
                <Container maxWidth={false}>
                    <Loader/>
                </Container>
            </StyledPage>
        );
    }

    if (isError) {
        return null;
    }

    return (
        <StyledPage className={classes.root} title={translate('Bot.Details.Meta.Title')}>
            <Container maxWidth={false}>
                <Header />
                <Results />
            </Container>
        </StyledPage>
    );
};

export default BotDetailsView;
