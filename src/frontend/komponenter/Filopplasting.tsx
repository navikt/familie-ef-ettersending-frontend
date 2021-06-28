import React from 'react';
import FileUpload from 'filopplasting';
import Filvisning from './Filvisning';
import { useState } from 'react';
import { Knapp } from 'nav-frontend-knapper';

const Filopplasting = () => {
  const [filer, setFiler] = useState([]);
  return (
    <div>
      <p>Dette er mine filer: </p>
      <Filvisning>{filer}</Filvisning>
      <FileUpload
        className="filopplasting"
        beforeFileDrop={() => console.log('Before drop')}
        afterFileDrop={() => console.log('After drop')}
        onFilesChanged={(filer) => {
          setFiler(filer);
        }}
      />
      <Knapp className="innsendingsknapp" type={'standard'}>
        Send inn
      </Knapp>
    </div>
  );
};

export default Filopplasting;
