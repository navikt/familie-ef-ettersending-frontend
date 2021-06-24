import React, { useContext } from 'react';
import { useApp } from '../context/AppContext';

const Display = () => {
  const context = useApp();
  console.log(context.testVerdi);
  return (
    <div>
      <h1>Context: {context.testVerdi}</h1>
    </div>
  );
};

export default Display;
