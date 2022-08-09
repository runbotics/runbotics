import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Bot from './bot';
import BotDetail from './bot-detail';
import BotUpdate from './bot-update';
import BotDeleteDialog from './bot-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={BotUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={BotUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={BotDetail} />
      <ErrorBoundaryRoute path={match.url} component={Bot} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={BotDeleteDialog} />
  </>
);

export default Routes;
