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

export const åpnePdfIEgenTab = (blob: Blob, filnavn: string): void => {
  const blobUrl = URL.createObjectURL(blob);
  const newWindow = window.open(blobUrl, '_blank');
  setTimeout(function () {
    if (newWindow) {
      newWindow.document.title = filnavn;
    }
  }, 500);
};

export const base64toBlob = (
  b64Data: string,
  contentType = '',
  sliceSize = 512
): Blob => {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });
  return blob;
};
