import React, { useCallback, useRef, useState } from 'react';
import { Button, Flex, Rhythm, Typography, useComponentId } from '@phork/phorkit';
import utilityStyles from '@phork/phorkit/styles/modules/common/Utils.module.css';
import { InputContainer } from 'components/InputContainer';
import { UploadIcon } from 'icons/UploadIcon';
import styles from './FileUpload.module.css';

export type FileUploadProps = Omit<React.HTMLAttributes<HTMLFormElement>, 'onDragEnter'> &
  Pick<React.InputHTMLAttributes<HTMLInputElement>, 'accept'> & {
    height?: number;
    title?: string;
    handleFiles: (files: FileList) => void;
  };

export function FileUpload({
  accept,
  id,
  handleFiles,
  height,
  title = 'Drag and drop your files here',
  ...props
}: FileUploadProps): JSX.Element {
  const { componentId, generateComponentId } = useComponentId(id);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback<React.DragEventHandler<HTMLElement>>(e => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback<React.DragEventHandler<HTMLElement>>(
    e => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles],
  );

  const handleChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>(
    e => {
      e.preventDefault();
      if (e.target.files && e.target.files[0]) {
        handleFiles(e.target.files);
      }
    },
    [handleFiles],
  );

  const handleButtonClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  return (
    <form
      className={styles.form}
      id={componentId}
      onDragEnter={handleDrag}
      onSubmit={useCallback(e => e.preventDefault, [])}
      {...props}
    >
      <input
        accept={accept}
        className={utilityStyles.visuallyHidden}
        id={generateComponentId('input')}
        multiple={true}
        onChange={handleChange}
        ref={inputRef}
        type="file"
      />
      <label htmlFor={generateComponentId('input')} id={generateComponentId('label')}>
        <InputContainer
          className={styles.container}
          color={dragActive ? 'secondary' : 'transparent'}
          style={{ height }}
        >
          <Flex full alignItems="center" direction="column" justifyContent="center">
            <Rhythm p={2}>
              <UploadIcon size={80} />
            </Rhythm>
            <Rhythm p={3}>
              <Typography color="primary" size="5xlarge">
                {title}
              </Typography>
            </Rhythm>
            <Typography color="secondary" size="large">
              or
              <Rhythm mx={1}>
                <Button
                  align="center"
                  as="button"
                  color="neutral"
                  onClick={handleButtonClick}
                  shape="brick"
                  size="medium"
                  type="button"
                  weight="inline"
                >
                  choose a file
                </Button>
              </Rhythm>
              to upload
            </Typography>
          </Flex>
          {dragActive && (
            <div
              className={styles.dropTarget}
              id={generateComponentId('zone')}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            ></div>
          )}
        </InputContainer>
      </label>
    </form>
  );
}
