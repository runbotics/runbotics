import React, { useEffect } from 'react';
import styled from 'styled-components';
import type { FC } from 'react';
import { Container } from '@mui/material';
import useTranslations from 'src/hooks/useTranslations';
import { useHistory, useParams } from 'react-router-dom';
import Page from 'src/components/pages/Page';
import { BotParams } from 'src/utils/types/BotParams';
import { useDispatch } from 'src/store';
import { botActions } from 'src/store/slices/Bot';
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

const BotListView: FC = () => {
    const { id } = useParams<BotParams>();
    const dispatch = useDispatch();
    const history = useHistory();
    const { translate } = useTranslations();

    useEffect(() => {
        const botId = Number(id);

        if (Number.isNaN(botId)) {
            history.replace('/404');
            return;
        }

        dispatch(botActions.getById({ id: botId }));
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
