import { useEffect, useState } from 'react';
import React, { createContext } from 'react';

import createUseContext from 'constate';

const [AppProvider, useApp] = createUseContext(() => {
  const [testVerdi, setTestVerdi] = useState('Default testverdi');

  return {
    testVerdi,
    setTestVerdi,
  };
});

export { AppProvider, useApp };
