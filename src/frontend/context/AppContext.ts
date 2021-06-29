import { useState } from 'react';

import createUseContext from 'constate';

const [AppProvider, useApp] = createUseContext(() => {
  const [testVerdi, setTestVerdi] = useState('Default testverdi');

  return {
    testVerdi,
    setTestVerdi,
  };
});

export { AppProvider, useApp };
