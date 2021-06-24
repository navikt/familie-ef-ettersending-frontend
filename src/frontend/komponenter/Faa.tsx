import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Knapp } from 'nav-frontend-knapper';

const Faa = () => {
  const context = useApp();

  const [input, endreInput] = useState('');

  function endreContext(input) {
    context.setTestVerdi(input);
  }

  return (
    <div>
      <input type="text" onChange={(e) => endreInput(e.target.value)}></input>
      <Knapp onClick={() => endreContext(input)} type={'standard'}>
        knapp
      </Knapp>
    </div>
  );
};

export default Faa;
