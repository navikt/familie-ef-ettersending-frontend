import React from 'react';

interface IVedleggsvisning {
  children: Array<any>;
}

const Vedleggsvisning = (props: IVedleggsvisning) => {
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

export default Vedleggsvisning;
