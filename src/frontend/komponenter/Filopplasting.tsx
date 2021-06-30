import React from 'react';
import FileUpload from 'filopplasting';
import Filvisning from './Filvisning';
import { useState } from 'react';

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
    </div>
  );
};

export default Filopplasting;
