import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
// import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
// import 'src/assets/css/prism.css';
import 'fontsource-roboto';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { enableES5 } from 'immer';
import * as serviceWorker from 'src/serviceWorker';
import store from 'src/store';
import { SettingsProvider } from 'src/contexts/SettingsContext';
import App from 'src/App';

enableES5();

ReactDOM.render(
    <Provider store={store}>
        <SettingsProvider>
            <App />
        </SettingsProvider>
    </Provider>,
    document.getElementById('root'),
);

serviceWorker.unregister();
