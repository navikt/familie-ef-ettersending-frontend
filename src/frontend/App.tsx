import React from 'react';
import { Checkbox } from 'nav-frontend-skjema';
import './app.less';

import Display from './komponenter/Display';
import Form from './komponenter/Form';

const App = () => {
  return (
    <div className="fullside">
      <h1>My React and TypeScript App!</h1>

      <Checkbox label={'Checkbox'} />

      <Display></Display>
      <Form></Form>
    </div>
  );
};

export default App;
