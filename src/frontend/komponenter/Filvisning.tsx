import React, { useState } from 'react';

interface IFilvisning {
  children: Array<any>;
}

const Filvisning = (props: IFilvisning) => {
  return (
    <div className="filviser">
      <ul>
        {props.children.map((prop, index) => (
          <li key={index}>{prop.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Filvisning;
