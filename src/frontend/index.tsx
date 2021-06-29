import React from 'react';
import ReactDOM from 'react-dom';
import Routes from './Routes';
import './index.less';
import { AppProvider } from './context/AppContext';

ReactDOM.render(
  <React.StrictMode>
    <AppProvider>
      <Routes />
    </AppProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
