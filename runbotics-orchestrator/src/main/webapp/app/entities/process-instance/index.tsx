import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import ProcessInstance from './process-instance';
import ProcessInstanceDetail from './process-instance-detail';
import ProcessInstanceUpdate from './process-instance-update';
import ProcessInstanceDeleteDialog from './process-instance-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={ProcessInstanceUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={ProcessInstanceUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={ProcessInstanceDetail} />
      <ErrorBoundaryRoute path={match.url} component={ProcessInstance} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={ProcessInstanceDeleteDialog} />
  </>
);

export default Routes;
