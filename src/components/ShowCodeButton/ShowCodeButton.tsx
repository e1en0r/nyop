import React, { cloneElement, lazy, Suspense, useCallback, useContext } from 'react';
import { ForwardProps, ModalContext } from '@phork/phorkit';
import { ModalLoader } from 'modals/ModalLoader';
import { Pixel } from 'utils/types';

const ShowCodeModal = lazy(() => import('modals/CodeModal').then(({ CodeModal }) => ({ default: CodeModal })));
const MODAL_ID = 'ShowCode';

export type ShowCodeButtonProps<E extends React.ElementType> = Partial<React.ComponentPropsWithoutRef<E>> & {
  children: React.ReactElement;
  code?: Pixel[];
};

export const ShowCodeButton = <E extends React.ElementType>({
  children,
  code,
  ...props
}: ShowCodeButtonProps<E>): React.ReactElement | null => {
  const { createModal } = useContext(ModalContext);

  const handleClick = useCallback(() => {
    createModal(
      <ForwardProps>
        {props => (
          <Suspense fallback={<ModalLoader size="medium" />}>
            <ShowCodeModal code={code!} id={MODAL_ID} {...props} />
          </Suspense>
        )}
      </ForwardProps>,
    );
  }, [code, createModal]);

  return code
    ? cloneElement(children, {
        onClick: handleClick,
        ...props,
      })
    : null;
};

ShowCodeButton.displayName = 'ShowCodeButton';
