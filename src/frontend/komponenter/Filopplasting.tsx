import React, { useEffect } from 'react';
import FileUpload from 'filopplasting';
import Filvisning from './Filvisning';
import { useState } from 'react';
import { useApp } from '../context/AppContext';

interface Props {
  props: any;
}

const Filopplasting = (props: Props) => {
  const [filer, settFiler] = useState([]);
  const context = useApp();

  return (
    <div>
      <p>Dette er mine filer: </p>
      <Filvisning>{filer}</Filvisning>
      <FileUpload
        className="filopplasting"
        onFilesChanged={(enFil) => {
          console.log(enFil[0]);
          context.leggTilTuppel([enFil[0], props.props]);
        }}
      />
    </div>
  );
};

export default Filopplasting;
