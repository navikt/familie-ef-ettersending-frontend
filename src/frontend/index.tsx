import React from 'react';
import '@navikt/ds-css';
import { AppProvider } from './context/AppContext';
import { createRoot } from 'react-dom/client';
import { Modal } from '@navikt/ds-react';
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container!);

// Gjemmer innhold i bakkant av modal for skjermlesere når modalen er åpen
Modal.setAppElement(container);

root.render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>
);
