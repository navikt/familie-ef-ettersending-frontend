import React from 'react';
import { FileUpload } from '@navikt/ds-react';

export interface FilvelgerProps {
  label?: string;
  description?: string;
  onSelect: (files: File[]) => void;
  accept?: string;
  maxSizeInBytes?: number;
  validator?: (file: File) => true | string;
  disabled?: boolean;
}

export const Filvelger: React.FC<FilvelgerProps> = ({
  label = 'Velg filer',
  description,
  onSelect,
  accept = '.pdf,.jpg,.jpeg,.png',
  maxSizeInBytes,
  validator,
  disabled = false,
}) => {
  const handleSelect = (_files: unknown, partitionedFiles: unknown): void => {
    const partitioned = partitionedFiles as {
      accepted: File[];
      rejected: unknown[];
    };
    const acceptedFiles = partitioned.accepted;
    if (acceptedFiles && acceptedFiles.length > 0) {
      onSelect(acceptedFiles);
    }
  };

  return (
    <FileUpload.Dropzone
      label={label}
      description={description}
      accept={accept}
      maxSizeInBytes={maxSizeInBytes}
      validator={validator}
      onSelect={handleSelect}
      disabled={disabled}
      multiple
    />
  );
};
