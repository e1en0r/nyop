export const createImageUploader =
  ({
    setSource,
    handleError,
    setFullSource,
  }: {
    setSource: (source: string | undefined) => void;
    handleError: (title: string, content: string) => void;
    setFullSource?: (file: File | undefined) => void;
  }) =>
  (files: FileList): void => {
    const file = files[0];

    if (['image/png', 'image/gif', 'image/jpeg'].includes(file.type)) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          if (typeof reader.result === 'string') {
            setFullSource?.(file);
            return setSource(reader.result);
          } else {
            handleError('Upload error', 'There was an error processing the image file upload.');
          }
        } else {
          handleError('Upload error', 'Unable to read the image file.');
        }
      };
      reader.readAsDataURL(file);
    } else {
      handleError('Upload error', 'Invalid file type. File types supported are PNG, GIF and JPG');
    }

    setFullSource?.(undefined);
    return setSource(undefined);
  };
