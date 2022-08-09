import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import ProcessInstanceEvent from './process-instance-event';
import ProcessInstanceEventDetail from './process-instance-event-detail';
import ProcessInstanceEventUpdate from './process-instance-event-update';
import ProcessInstanceEventDeleteDialog from './process-instance-event-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={ProcessInstanceEventUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={ProcessInstanceEventUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={ProcessInstanceEventDetail} />
      <ErrorBoundaryRoute path={match.url} component={ProcessInstanceEvent} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={ProcessInstanceEventDeleteDialog} />
  </>
);

export default Routes;
