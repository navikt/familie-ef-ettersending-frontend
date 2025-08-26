import React from 'react';
import { Upload } from '@navikt/ds-icons';
import { BodyShort } from '@navikt/ds-react';
import type { DropzoneInputProps, DropzoneRootProps } from 'react-dropzone';
import styles from './Filvelger.module.css';

export const Filvelger: React.FC<{
  getRootProps: <T extends DropzoneRootProps>(props?: T) => T;
  getInputProps: <T extends DropzoneInputProps>(props?: T) => T;
}> = ({ getRootProps, getInputProps }) => {
  return (
    <div className={styles.filvelger}>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <Upload className={styles.ikon} title={'Last opp'} />
        <BodyShort className={styles.tekst}>Velg filer</BodyShort>
      </div>
    </div>
  );
};
