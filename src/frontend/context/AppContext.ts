import { useEffect, useState } from 'react';
import React, { createContext } from 'react';

import createUseContext from 'constate';

//createUseContext?

const [AppProvider, useApp] = createUseContext(() => {
  const [testVerdi, setTestVerdi] = useState('Dette er fra Appcontext');

  return {
    testVerdi,
    setTestVerdi,
  };
});

export { AppProvider, useApp };
