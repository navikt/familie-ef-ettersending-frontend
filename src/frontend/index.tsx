import React from 'react';
import AppRoutes from './AppRoutes';
import '@navikt/ds-css';
import 'nav-frontend-core';
import { AppProvider } from './context/AppContext';
import { createRoot } from 'react-dom/client';
import { Modal } from '@navikt/ds-react';

const container = document.getElementById('root');
const root = createRoot(container!);

// Gjemmer innhold i bakkant av modal for skjermlesere når modalen er åpen
Modal.setAppElement(container);

root.render(
  <React.StrictMode>
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  </React.StrictMode>
);
