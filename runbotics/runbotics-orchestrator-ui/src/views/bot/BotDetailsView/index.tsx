import { useEffect, FC } from 'react';
import styled from 'styled-components';
import { Container } from '@mui/material';
import useTranslations from 'src/hooks/useTranslations';
import Page from 'src/components/pages/Page';
import { useDispatch } from 'src/store';
import { botActions } from 'src/store/slices/Bot';
import Header from './Header';
import Results from './Results';
import { useRouter } from 'next/router';

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

const BotListView: FC = () => {
    const router = useRouter();
    const { id } = router.query;
    const dispatch = useDispatch();
    const { translate } = useTranslations();

    useEffect(() => {
        const botId = Number(id);

        if (Number.isNaN(botId)) {
            router.replace('/404');
            return;
        }

        dispatch(botActions.getById({ id: botId }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    return (
        <StyledPage className={classes.root} title={translate('Bot.Details.Meta.Title')}>
            <Container maxWidth={false}>
                <Header />
                <Results />
            </Container>
        </StyledPage>
    );
};

export default BotListView;
