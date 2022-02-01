import React from 'react';
import ReactDOM from 'react-dom';
import AppRoutes from './AppRoutes';
import './index.less';
import '@navikt/ds-css';
import { AppProvider } from './context/AppContext';

ReactDOM.render(
  <React.StrictMode>
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
