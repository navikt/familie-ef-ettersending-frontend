import React from 'react';
import FileUpload from 'filopplasting';

const Filopplasting = () => {
  return (
    <FileUpload
      className="filopplasting"
      beforeFileDrop={() => console.log('Before drop')}
      afterFileDrop={() => console.log('After drop')}
      onFilesChanged={(files) => {
        const test = files.map((file) => file.name);
        console.log('I have ' + files.length + ' files');
        console.log(test);
      }}
    />
  );
};

export default Filopplasting;
