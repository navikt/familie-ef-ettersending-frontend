import React from 'react';
import { Checkbox } from 'nav-frontend-skjema';
import './app.less';

import Foo from './komponenter/Foo';
import Faa from './komponenter/Faa';

import { AppProvider } from './context/AppContext';

const App = () => {
  return (
    <div className="fullside">
      <AppProvider>
        <h1>My React and TypeScript App!</h1>

        <Checkbox label={'Checkbox'} />

        <Foo></Foo>

        <Faa></Faa>
      </AppProvider>
    </div>
  );
};

export default App;
