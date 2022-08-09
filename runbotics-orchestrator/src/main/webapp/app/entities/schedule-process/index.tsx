import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import ScheduleProcess from './schedule-process';
import ScheduleProcessDetail from './schedule-process-detail';
import ScheduleProcessUpdate from './schedule-process-update';
import ScheduleProcessDeleteDialog from './schedule-process-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={ScheduleProcessUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={ScheduleProcessUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={ScheduleProcessDetail} />
      <ErrorBoundaryRoute path={match.url} component={ScheduleProcess} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={ScheduleProcessDeleteDialog} />
  </>
);

export default Routes;
