import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import DocumentationPage from './documentation-page';
import DocumentationPageDetail from './documentation-page-detail';
import DocumentationPageUpdate from './documentation-page-update';
import DocumentationPageDeleteDialog from './documentation-page-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={DocumentationPageUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={DocumentationPageUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={DocumentationPageDetail} />
      <ErrorBoundaryRoute path={match.url} component={DocumentationPage} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={DocumentationPageDeleteDialog} />
  </>
);

export default Routes;
