import React from 'react';
import './app.less';

import DisplayContext from './komponenter/DisplayContext';
import InputForm from './komponenter/InputForm';

const App = () => {
  return (
    <div className="fullside">
      <DisplayContext></DisplayContext>
      <InputForm></InputForm>
    </div>
  );
};

export default App;
