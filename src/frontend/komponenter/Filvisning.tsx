import React, { useState } from 'react';
import { Knapp } from 'nav-frontend-knapper';

interface Iprops {
  children: any;
}

const Filvisning = (props: Iprops) => {
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
