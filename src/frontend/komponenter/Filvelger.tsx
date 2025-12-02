import React from 'react';
import { BodyShort } from '@navikt/ds-react';
import { DropzoneInputProps, DropzoneRootProps } from 'react-dropzone/.';
import styles from './Filvelger.module.css';
import { UploadIcon } from '@navikt/aksel-icons';

export const Filvelger: React.FC<{
  getRootProps: <T extends DropzoneRootProps>(props?: T) => T;
  getInputProps: <T extends DropzoneInputProps>(props?: T) => T;
}> = ({ getRootProps, getInputProps }) => {
  return (
    <div className={styles.filvelger}>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <UploadIcon
          className={styles.ikon}
          title="Last opp"
          fontSize="1.5rem"
        />
        <BodyShort className={styles.tekst}>Velg filer</BodyShort>
      </div>
    </div>
  );
};
