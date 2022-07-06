import React from 'react';
import AppRoutes from './AppRoutes';
import '@navikt/ds-css';
import 'nav-frontend-core';
import { AppProvider } from './context/AppContext';
import { createRoot } from 'react-dom/client';

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  </React.StrictMode>
);
