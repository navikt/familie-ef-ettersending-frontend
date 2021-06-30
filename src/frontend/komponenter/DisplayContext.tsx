import React from 'react';
import { useApp } from '../context/AppContext';

const DisplayContext = () => {
  const context = useApp();
  return (
    <div>
      <h3>Context: {context.testVerdi}</h3>
    </div>
  );
};

export default DisplayContext;
