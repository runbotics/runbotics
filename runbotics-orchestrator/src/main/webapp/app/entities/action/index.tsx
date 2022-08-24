import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Action from './action';
import ActionDetail from './action-detail';
import ActionUpdate from './action-update';
import ActionDeleteDialog from './action-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={ActionUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={ActionUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={ActionDetail} />
      <ErrorBoundaryRoute path={match.url} component={Action} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={ActionDeleteDialog} />
  </>
);

export default Routes;
