export const formaterFilstørrelse = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export const filstørrelse_10MB = 1024 * 1024 * 10;

export const erFiltypeHeic = (fil: File) => {
  return (
    fil.type.toLowerCase() === 'image/heic' ||
    fil.type.toLowerCase() === 'image/heif' ||
    fil.name.toLowerCase().endsWith('.heic')
  );
};

export const støtterFiltypeHeic = (): boolean => false;
export const tillateFiltyper = ['pdf', 'jpg', 'png', 'jpeg'];

export const sjekkTillatFiltype = (filtype: string) => {
  return tillateFiltyper.some((type) => {
    return filtype.includes(type);
  });
};
