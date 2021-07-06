import React, { useState } from 'react';

interface IVedleggsvisning {
  children: Array<any>;
}

const Vedleggsvisning = (props: IVedleggsvisning) => {
  return (
    <div className="vedleggsviser">
      <ul>
        {props.children.map((prop, index) => (
          <li key={index}>{prop.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Vedleggsvisning;
