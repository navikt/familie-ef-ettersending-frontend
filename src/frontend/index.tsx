import React from 'react';
import '@navikt/ds-css';
import { AppProvider } from './context/AppContext';
import { TogglesProvider } from './context/TogglesContext';
import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <AppProvider>
      <TogglesProvider>
        <App />
      </TogglesProvider>
    </AppProvider>
  </React.StrictMode>,
);
