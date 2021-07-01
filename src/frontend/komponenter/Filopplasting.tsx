import React, { useEffect } from 'react';
import FileUpload from 'filopplasting';
import Filvisning from './Filvisning';
import { useState } from 'react';
import { useApp } from '../context/AppContext';

interface Props {
  id: number;
}

const Filopplasting = (krav: Props) => {
  const [filer, leggTilFil] = useState([]);
  const context = useApp();

  return (
    <div>
      <p>Dette er mine filer: </p>
      <Filvisning>{filer}</Filvisning>
      <FileUpload
        className="filopplasting"
        onFilesChanged={(fil) => {
          leggTilFil(fil);
          context.leggTilDokument([fil[0], krav.id]);
        }}
      />
    </div>
  );
};

export default Filopplasting;
