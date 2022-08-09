import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Container, LinearProgress } from '@mui/material';
import { useParams } from 'react-router-dom';
import Page from 'src/components/pages/Page';
import { useDispatch, useSelector } from 'src/store';
import { processInstanceActions, processInstanceSelector } from 'src/store/slices/ProcessInstance';
import useTranslations from 'src/hooks/useTranslations';
import Header from './Header';
import Results from './Results';

const PREFIX = 'Index';

const classes = {
    root: `${PREFIX}-root`,
};

const Root = styled.div(({ theme }) => ({
    [`& .${classes.root}`]: {
        backgroundColor: theme.palette.background.default,
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: 100,
    },
}));

const Index = () => {
    const params: Record<string, any> = useParams();
    const processInstances = useSelector(processInstanceSelector);
    const processInstance = processInstances.all.byId[params.processInstance];
    const { translate } = useTranslations();

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(processInstanceActions.getProcessInstance({ processInstanceId: params.processInstance }));
    }, []);

    return (
        <Root>
            <Page className={classes.root} title={translate('Process.ProcessInstanceView.Meta.Title')}>
                <Container maxWidth={false}>
                    {!processInstance && <LinearProgress />}
                    {processInstance && (
                        <>
                            <Header processInstance={processInstance} />
                            <Results processInstance={processInstance} />
                        </>
                    )}
                </Container>
            </Page>
        </Root>
    );
};

export default Index;
