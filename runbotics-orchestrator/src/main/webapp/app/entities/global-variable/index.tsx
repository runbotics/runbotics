import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import GlobalVariable from './global-variable';
import GlobalVariableDetail from './global-variable-detail';
import GlobalVariableUpdate from './global-variable-update';
import GlobalVariableDeleteDialog from './global-variable-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={GlobalVariableUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={GlobalVariableUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={GlobalVariableDetail} />
      <ErrorBoundaryRoute path={match.url} component={GlobalVariable} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={GlobalVariableDeleteDialog} />
  </>
);

export default Routes;
