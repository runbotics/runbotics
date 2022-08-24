import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Process from './process';
import ProcessDetail from './process-detail';
import ProcessUpdate from './process-update';
import ProcessDeleteDialog from './process-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={ProcessUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={ProcessUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={ProcessDetail} />
      <ErrorBoundaryRoute path={match.url} component={Process} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={ProcessDeleteDialog} />
  </>
);

export default Routes;
