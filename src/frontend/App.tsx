import React from 'react';
import './app.less';

import Display from './komponenter/Display';
import Form from './komponenter/Form';

const App = () => {
  return (
    <div className="fullside">
      <Display></Display>
      <Form></Form>
    </div>
  );
};

export default App;
