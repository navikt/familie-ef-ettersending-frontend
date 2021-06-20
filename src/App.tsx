import React from 'react';
import { Knapp } from 'nav-frontend-knapper';
import { Checkbox } from 'nav-frontend-skjema';
import './app.less';

const App = () => {
  return (
    <>
      <p>Dette er en endring</p>

      <h1>My React and TypeScript App! {new Date().toLocaleDateString()}</h1>

      <Knapp type={'standard'}>HEI</Knapp>
      <Checkbox label={'Checkbox'} />
    </>
  );
};

export default App;
