import React, { useContext } from 'react';
import { useApp } from '../context/AppContext';

const Foo = () => {
  const test = useApp();
  console.log(test.testVerdi);
  return (
    <div>
      <h1>Context: {test.testVerdi}</h1>
    </div>
  );
};

export default Foo;
