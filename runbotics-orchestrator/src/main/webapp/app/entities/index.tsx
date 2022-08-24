import React from 'react';
import { Switch } from 'react-router-dom';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Process from './process';
import Bot from './bot';
import ScheduleProcess from './schedule-process';
import ProcessInstance from './process-instance';
import ProcessInstanceEvent from './process-instance-event';
import Activity from './activity';
import Action from './action';
import DocumentationPage from './documentation-page';
/* jhipster-needle-add-route-import - JHipster will add routes here */

const Routes = ({ match }) => (
  <div>
    <Switch>
      {/* prettier-ignore */}
      <ErrorBoundaryRoute path={`${match.url}process`} component={Process} />
      <ErrorBoundaryRoute path={`${match.url}bot`} component={Bot} />
      <ErrorBoundaryRoute path={`${match.url}schedule-process`} component={ScheduleProcess} />
      <ErrorBoundaryRoute path={`${match.url}process-instance`} component={ProcessInstance} />
      <ErrorBoundaryRoute path={`${match.url}process-instance-event`} component={ProcessInstanceEvent} />
      <ErrorBoundaryRoute path={`${match.url}activity`} component={Activity} />
      <ErrorBoundaryRoute path={`${match.url}action`} component={Action} />
      <ErrorBoundaryRoute path={`${match.url}documentation-page`} component={DocumentationPage} />
      {/* jhipster-needle-add-route-path - JHipster will add routes here */}
    </Switch>
  </div>
);

export default Routes;
