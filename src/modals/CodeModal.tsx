import copy from 'copy-to-clipboard';
import { useCallback, useMemo, useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';
import {
  Flex,
  IconButton,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Typography,
  Rhythm,
  ModalProps,
  Textbox,
  TextboxProps,
} from '@phork/phorkit';
import { PIXELS_PER_GRID, SQUARES_PER_ROW } from 'config/sizes';
import { Pixel } from 'utils/types';
import { CheckIcon } from 'icons/CheckIcon';
import { ClipboardIcon } from 'icons/ClipboardIcon';

export type CodeModalProps = Omit<ModalProps, 'children' | 'focusable' | 'size'> & { id?: string; code: Pixel[] };

export const CodeModal = ({ id: initId, code: initCode, ...props }: CodeModalProps): JSX.Element => {
  const id = initId || uuid();
  const contentRef = useRef<HTMLDivElement>(null);
  const [code, setCode] = useState<Pixel[]>();
  const [nyop, setNyop] = useState<number>();

  const handleNyopChange = useCallback<NonNullable<TextboxProps['onChange']>>((_event, value) => {
    const numeric = +value;
    setNyop(isNaN(numeric) ? undefined : numeric);
  }, []);

  const handleNyopClear = useCallback<NonNullable<TextboxProps['onClear']>>(() => {
    setNyop(undefined);
    setCode(undefined);
  }, []);

  const handleSubmit = useCallback(() => {
    if (nyop) {
      const nyopX = (nyop - 1) % SQUARES_PER_ROW;
      const nyopY = Math.floor((nyop - 1) / SQUARES_PER_ROW);
      setCode(
        initCode.map(({ location, ...rest }) => ({
          location: {
            x: location.x + nyopX * PIXELS_PER_GRID,
            y: location.y + nyopY * PIXELS_PER_GRID,
          },
          ...rest,
        })),
      );
    }
  }, [initCode, nyop]);

  const raw = useMemo(
    () =>
      code
        ? `
    var pixels = ${JSON.stringify(code)};
    localStorage.setItem('pixels', JSON.stringify([...JSON.parse(localStorage.getItem('pixels') || '[]'), ...pixels]));
  `
        : undefined,
    [code],
  );

  const handleCopy = useCallback(() => copy(raw || ''), [raw]);

  return (
    <Modal focusable contextId={id} size="large" {...props}>
      <ModalHeader align="left" key="header" modalId={id}>
        <Rhythm mt={4}>
          <Flex alignItems="center" direction="row">
            <Textbox
              clearable
              color="neutral"
              label="NYOP number"
              onChange={handleNyopChange}
              onClear={handleNyopClear}
              size="large"
              type="number"
              value={nyop || ''}
              variant="filled"
              width={180}
            />
            <Rhythm ml={2}>
              <IconButton
                color="primary"
                disabled={!nyop}
                onClick={handleSubmit}
                shape="square"
                size="2xlarge"
                weight="shaded"
              >
                <CheckIcon scale="xlarge" />
              </IconButton>
            </Rhythm>
            {raw && (
              <Rhythm ml={2}>
                <IconButton color="primary" onClick={handleCopy} shape="square" size="2xlarge" weight="shaded">
                  <ClipboardIcon scale="xlarge" />
                </IconButton>
              </Rhythm>
            )}
          </Flex>
        </Rhythm>
      </ModalHeader>
      <ModalBody scrollable key="content" ref={contentRef} style={{ height: 400, maxHeight: 400 }}>
        {code ? (
          <Typography variants={['line-height-comfy']}>
            <code>{raw}</code>
          </Typography>
        ) : (
          <Typography size="2xlarge" variants={['line-height-comfy']}>
            {`Enter your NYOP number above and this will generate some code for you to paste into the JavasScript console
            on the NYOP canvas. After you've run the code, reload the canvas and you should see your drawing in your square.`}
          </Typography>
        )}
      </ModalBody>
      <ModalFooter bordered key="footer">
        <Typography size="2xlarge" variants={['line-height-comfy']} weight="bold">
          {`Use at your own risk. It's never a good idea to blindly
          copy and paste code into the console.`}
        </Typography>
      </ModalFooter>
    </Modal>
  );
};
