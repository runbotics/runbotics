import React, { Suspense, Fragment, lazy, FC, VFC } from 'react';
import { Switch, Redirect, Route, RouteComponentProps, BrowserRouter } from 'react-router-dom';
import LoadingScreen from 'src/components/utils/LoadingScreen';
import AuthGuard from 'src/components/guards/AuthGuard';
import GuestGuard from 'src/components/guards/GuestGuard';
import { FeatureKey, Role } from 'runbotics-common';
import Secured from '../components/utils/Secured';
import MainLayout from '../layouts/MainLayout/MainLayout';

type Routes = {
    exact?: boolean;
    path?: string | string[];
    guard?: FC;
    layout?: VFC;
    component?: FC<RouteComponentProps>;
    routes?: Routes;
}[];

export const renderRoutes = (routes: Routes = []): JSX.Element => (
    <BrowserRouter>
        <Switch>
            {routes.map((route, index) => {
                const Guard = route.guard || Fragment;
                const Layout = route.layout || Fragment;
                const Component = route.component;

                return (
                    <Route
                        // eslint-disable-next-line react/no-array-index-key
                        key={index}
                        path={route.path}
                        exact={route.exact}
                        render={(props) => (
                            <Guard>
                                <Layout>{route.routes ? renderRoutes(route.routes) : <Component {...props} />}</Layout>
                            </Guard>
                        )}
                    />
                );
            })}
        </Switch>
    </BrowserRouter>
);

const routes: Routes = [
    {
        exact: true,
        path: '/404',
        component: lazy(() => import('src/views/errors/NotFoundView')),
    },
    {
        exact: true,
        path: '/empty',
        component: lazy(() => import('src/views/empty/EmptyView')),
    },
    // {
    //     exact: true,
    //     guard: GuestGuard,
    //     path: '/',
    //     component: lazy(() => import('src/views/auth/LoginView'))
    // },
    {
        exact: true,
        guard: GuestGuard,
        path: '/login',
        component: lazy(() => import('src/routing/LoginPage')),
    },
    {
        exact: true,
        guard: GuestGuard,
        path: '/register',
        component: lazy(() => import('src/views/auth/RegisterView')),
    },
    {
        exact: true,
        path: '/register-unprotected',
        component: lazy(() => import('src/views/auth/RegisterView')),
    },
    {
        path: '/app',
        guard: AuthGuard,
        layout: MainLayout,
        routes: [
            {
                exact: true,
                path: '/app/processes',
                component: lazy(() => import('src/views/process/ProcessBrowseView/ProcessBrowseView')),
                guard: ({ children }) => <Secured featureKeys={[FeatureKey.PROCESS_READ]}>{children}</Secured>,
            },
            {
                exact: true,
                path: '/app/processes/:id/:tab',
                component: lazy(() => import('src/views/process/ProcessMainView/ProcessMainView')),
                guard: ({ children }) => <Secured featureKeys={[FeatureKey.PROCESS_READ]}>{children}</Secured>,
            },
            {
                exact: true,
                path: '/app/bots/:id/details/:tab',
                component: lazy(() => import('src/views/bot/BotDetailsView')),
                guard: ({ children }) => <Secured featureKeys={[FeatureKey.BOT_READ]}>{children}</Secured>,
            },
            {
                exact: true,
                path: '/app/bots',
                component: lazy(() => import('src/views/bot/BotBrowseView')),
                guard: ({ children }) => <Secured featureKeys={[FeatureKey.BOT_READ]}>{children}</Secured>,
            },
            {
                exact: true,
                path: '/app/bots/:tab',
                component: lazy(() => import('src/views/bot/BotBrowseView')),
                guard: ({ children }) => <Secured featureKeys={[FeatureKey.BOT_READ]}>{children}</Secured>,
            },
            {
                exact: true,
                path: '/app/bots/:id/process-instance/:processInstance/:tab',
                component: lazy(() => import('src/views/bot/ProcessInstanceView')),
                guard: ({ children }) => <Secured featureKeys={[FeatureKey.BOT_READ]}>{children}</Secured>,
            },
            {
                exact: true,
                path: '/app/actions',
                component: lazy(() => import('src/views/action/ActionListView')),
                guard: ({ children }) => <Secured featureKeys={[FeatureKey.EXTERNAL_ACTION_READ]}>{children}</Secured>,
            },
            {
                exact: true,
                path: '/app/variables',
                component: lazy(() => import('src/views/variable/VariableListView')),
                guard: ({ children }) => <Secured featureKeys={[FeatureKey.GLOBAL_VARIABLE_READ]}>{children}</Secured>,
            },
            {
                exact: true,
                path: '/app/scheduler',
                component: lazy(() => import('src/views/scheduler/SchedulerView')),
                guard: ({ children }) => <Secured featureKeys={[FeatureKey.SCHEDULER_PAGE_READ]}>{children}</Secured>,
            },
            {
                exact: true,
                path: '/app/history',
                component: lazy(() => import('src/views/history/HistoryListView')),
                guard: ({ children }) => <Secured featureKeys={[FeatureKey.HISTORY_READ]}>{children}</Secured>,
            },
            {
                exact: true,
                path: '/app',
                component: () => <Redirect to="/app/processes" />,
            },
            {
                component: () => <Redirect to="/404" />,
            },
        ],
    },
    {
        exact: true,
        path: '/',
        component: () => <Redirect to="/app/processes" />,
    },
];

export default routes;
