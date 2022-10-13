import { FC } from 'react';
import routes, { renderRoutes } from '../routing/routes';

const App: FC = () => renderRoutes(routes);

export default App;
