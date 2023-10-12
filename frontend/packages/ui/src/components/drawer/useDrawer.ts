import React, { useEffect, useRef, useCallback } from 'react';

import { UseDrawerProps } from './Drawer.types';

export const useDrawer = (props: UseDrawerProps = {}) => {
  const isClient = typeof window !== 'undefined';

  const { isOpen, onClose, drawerId, disableCloseOnOverlayClick, disableClose, ...rest } = props;
  const handlerRef = useRef(onClose);

  useEffect(() => {
    handlerRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isClient) return;

    const eventListener = (event: KeyboardEvent) => {
      if (isOpen && !disableClose && event.key === 'Escape') {
        handlerRef.current?.();
      }
    };

    document.addEventListener('keydown', eventListener);

    return () => {
      document.removeEventListener('keydown', eventListener);
    };
  }, [isClient, isOpen, disableClose]);

  const onOverlayClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      event.stopPropagation();
      if (disableCloseOnOverlayClick || disableClose) {
        return;
      }

      onClose?.();
    },
    [onClose, disableCloseOnOverlayClick, disableClose]
  );

  const getDrawerDialogProps = useCallback(
    () => ({
      role: 'dialog',
      'aria-hidden': !isOpen,
      'aria-modal': true,
      'aria-labelledby': `${drawerId}-header`,
      'aria-describedby': `${drawerId}-body`,
    }),
    [drawerId, isOpen]
  );

  const getDrawerHeaderProps = useCallback(
    () => ({
      id: `${drawerId}-header`,
    }),
    [drawerId]
  );

  const getDrawerCloseButtonProps = useCallback(
    () => ({
      onClick: onClose,
    }),
    [onClose]
  );

  const getDrawerBodyProps = useCallback(
    () => ({
      id: `${drawerId}-body`,
    }),
    [drawerId]
  );

  return {
    getDrawerBodyProps,
    getDrawerCloseButtonProps,
    getDrawerDialogProps,
    getDrawerHeaderProps,
    isOpen,
    drawerId,
    onOverlayClick,
    ...rest,
  };
};
