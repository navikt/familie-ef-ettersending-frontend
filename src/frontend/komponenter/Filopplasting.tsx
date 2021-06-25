import React from 'react';
import FileUpload from 'filopplasting';

const Filopplasting = () => {
  return (
    <FileUpload
      className="filopplasting"
      beforeFileDrop={() => console.log('Before drop')}
      afterFileDrop={() => console.log('After drop')}
      onFilesChanged={(files) => {
        console.log(files);
      }}
    />
  );
};

export default Filopplasting;
