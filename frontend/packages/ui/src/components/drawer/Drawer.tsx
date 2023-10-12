/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import FocusTrap from 'focus-trap-react';
import { CSSTransition } from 'react-transition-group';

import { UI_PREFIX } from '../../config';
import { cx } from '../../utils/classNames';
import { createContext } from '../../utils/context';
import { IconControl } from '../icon/IconControl';
import { Title } from '../text/Title';

import {
  CommonDrawerProps,
  DrawerCloseButtonProps,
  DrawerContainerProps,
  DrawerContextType,
  DrawerPortalProps,
  DrawerProps,
  DrawerWrapperProps,
} from './Drawer.types';
import { useDrawer } from './useDrawer';

const isClient = typeof window !== undefined;
const useIsomorphicLayoutEffect = isClient ? useLayoutEffect : useEffect;

const DRAWER_CLASS = `${UI_PREFIX}__drawer`;
const DRAWER_CONTAINER_CLASS = `${DRAWER_CLASS}__container`;
const DRAWER_CLOSE_BUTTON_CLASS = `${DRAWER_CLASS}__close-button`;
const DRAWER_OVERLAY_CLASS = `${DRAWER_CLASS}__overlay`;
const DRAWER_DIALOG_CLASS = `${DRAWER_CLASS}__dialog`;
const DRAWER_HEADER_CLASS = `${DRAWER_CLASS}__header`;
const DRAWER_HEADER_TITLE_CLASS = `${DRAWER_CLASS}__header__title`;
const DRAWER_BODY_CLASS = `${DRAWER_CLASS}__body`;
const DRAWER_FOOTER_CLASS = `${DRAWER_CLASS}__footer`;

const DRAWER_ID = `${UI_PREFIX}-drawer`;
const DRAWER_ROOT_ID = 'drawer-root';

export const [DrawerProvider, useDrawerContext] = createContext<DrawerContextType>();

export const Drawer = ({
  bodyClassName,
  bodyContent,
  children,
  closeButtonProps,
  containerClassName,
  dialogClassName,
  footerClassName,
  footerContent,
  headerClassName,
  headerContent,
  headerTitleClassName,
  hideCloseButton = false,
  overlayClassName,
  ...restDrawerProps
}: DrawerProps) => {
  const headerContentContent =
    headerContent && typeof headerContent === 'string' ? (
      <DrawerHeaderTitle className={headerTitleClassName}>{headerContent}</DrawerHeaderTitle>
    ) : (
      headerContent
    );

  return (
    <DrawerWrapper {...restDrawerProps}>
      <DrawerContainer className={containerClassName} overlayClassName={overlayClassName}>
        <DrawerDialog className={dialogClassName}>
          {headerContent && (
            <DrawerHeader className={headerClassName}>
              {headerContentContent}{' '}
              {!hideCloseButton && <DrawerCloseButton {...closeButtonProps} />}
            </DrawerHeader>
          )}
          {(bodyContent || children) && (
            <DrawerBody className={bodyClassName}>
              <>
                {children}
                {bodyContent}
              </>
            </DrawerBody>
          )}
          {footerContent && (
            <DrawerFooter className={footerClassName}>{footerContent}</DrawerFooter>
          )}
        </DrawerDialog>
      </DrawerContainer>
    </DrawerWrapper>
  );
};

export const DrawerWrapper = React.forwardRef<HTMLDivElement, DrawerWrapperProps>(
  (
    {
      children,
      className = '',
      disableClose = false,
      disableCloseOnOverlayClick = false,
      disablePortal = false,
      disableTransition = false,
      finalFocusRef,
      focusTrapOptions = {},
      initialFocusRef,
      isOpen = false,
      keepMounted = false,
      drawerId = DRAWER_ID,
      rootId,
      formProps,
      onClose,
      onEnter,
      onEntered,
      onExit,
      onExited,
      removeFocusLock = false,
      size = 'md',
      transitionClassName = DRAWER_CLASS,
    },
    ref
  ) => {
    const useDrawerProps = useDrawer({
      disableClose,
      disableCloseOnOverlayClick,
      isOpen,
      drawerId,
      onClose,
    });

    const isClient = typeof window !== 'undefined';

    const portalIsDisabled = disablePortal || !isClient;

    const drawerCtx = useMemo<DrawerContextType>(
      () => ({
        ...useDrawerProps,
        size,
      }),
      [useDrawerProps, size]
    );

    const _children = portalIsDisabled ? (
      <div ref={ref} className={cx(DRAWER_CLASS, className)}>
        {children}
      </div>
    ) : (
      <DrawerPortal ref={ref} rootId={rootId}>
        {formProps && (
          <form {...formProps} className={cx(DRAWER_CLASS, className)}>
            {children}
          </form>
        )}
        {!formProps && <div className={cx(DRAWER_CLASS, className)}>{children}</div>}
      </DrawerPortal>
    );

    const onDeactivate = useCallback(() => {
      if (finalFocusRef?.current) {
        finalFocusRef.current.focus();
      }
    }, [finalFocusRef]);

    /**
     * When the drawer fades in with a transition, there is a brief delay until the contents
     * become focusable after visibility is set to 'visible'. This function creates an interval to
     * check whether the container is focusable, and then traps focus.
     */
    const checkCanFocusTrap = useCallback(
      ([container]: (HTMLElement | SVGElement)[]) => {
        return new Promise<void>((resolve) => {
          if (typeof window === 'undefined') {
            resolve();
            return;
          }

          const interval = setInterval(() => {
            if (getComputedStyle(container).visibility === 'hidden') return;

            resolve();
            if (initialFocusRef?.current) {
              initialFocusRef?.current.focus();
            }
            clearInterval(interval);
          }, 5);
        });
      },
      [initialFocusRef]
    );

    // Overwrite class names from package to follow BEM
    const transitionClassNames = useMemo(
      () => ({
        enter: `${transitionClassName}--enter`,
        enterActive: `${transitionClassName}--enter-active`,
        enterDone: `${transitionClassName}--enter-done`,
        exit: `${transitionClassName}--exit`,
        exitActive: `${transitionClassName}--exit-active`,
        exitDone: `${transitionClassName}--exit-done`,
        appear: `${transitionClassName}--appear`,
        appearActive: `${transitionClassName}--appear-active`,
        appearDone: `${transitionClassName}--appear-done`,
      }),
      [transitionClassName]
    );

    return (
      <DrawerProvider value={{ ...drawerCtx, initialFocusRef }}>
        {/* UI-TODO: remove ignore */}
        {/* @ts-ignore */}
        <CSSTransition
          onEnter={onEnter}
          onEntered={onEntered}
          onExit={onExit}
          onExited={onExited}
          classNames={transitionClassNames}
          in={isOpen}
          timeout={disableTransition ? 0 : 250}
          unmountOnExit={!keepMounted}
        >
          <FocusTrap
            active={isOpen && !removeFocusLock}
            focusTrapOptions={{
              clickOutsideDeactivates: !disableCloseOnOverlayClick,
              returnFocusOnDeactivate: finalFocusRef?.current ? false : true,
              checkCanFocusTrap,
              onDeactivate,
              ...focusTrapOptions,
            }}
          >
            {_children}
          </FocusTrap>
        </CSSTransition>
      </DrawerProvider>
    );
  }
);

// UI-TODO: remove ignore
// @ts-ignore
const DrawerPortal = React.forwardRef<HTMLDivElement, DrawerPortalProps>(
  ({ children, rootId = DRAWER_ROOT_ID }, ref) => {
    const elementRef = useRef(document.createElement('div'));

    useIsomorphicLayoutEffect(() => {
      let root = document.querySelector(`#${rootId}`) as HTMLElement;

      if (root === null) {
        root = document.createElement('div');
        root.setAttribute('id', rootId);
        document.body.appendChild(root);
      }
      const { current } = elementRef;

      root.appendChild(current);

      return () => {
        root.removeChild(current);
      };
    }, []);

    const _children = React.Children.map(children, (child, index) => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, {
          ...child.props,
          ...(index === 0 && { ref }),
        });
      }
    });

    return createPortal(_children, elementRef.current);
  }
);

export const DrawerContainer = React.forwardRef<HTMLDivElement, DrawerContainerProps>(
  ({ children, className, overlayClassName, ...rest }, ref) => {
    const { size, onOverlayClick, isOpen } = useDrawerContext();

    return (
      <div
        ref={ref}
        className={cx(
          DRAWER_CONTAINER_CLASS,
          {
            [`${DRAWER_CONTAINER_CLASS}--full`]: size === 'full',
          },
          className
        )}
        {...rest}
      >
        <div
          onClick={(e) => onOverlayClick(e)}
          className={cx(
            DRAWER_OVERLAY_CLASS,
            {
              [`${DRAWER_OVERLAY_CLASS}--open`]: isOpen,
            },
            overlayClassName
          )}
        />
        {children}
      </div>
    );
  }
);

export const DrawerDialog = ({ children, className, ...restProps }: CommonDrawerProps) => {
  const { getDrawerDialogProps, isOpen, size } = useDrawerContext();

  return (
    <div
      {...getDrawerDialogProps()}
      className={cx(
        DRAWER_DIALOG_CLASS,
        `${DRAWER_DIALOG_CLASS}--${size}`,
        {
          [`${DRAWER_DIALOG_CLASS}--open`]: isOpen,
        },
        className
      )}
      {...restProps}
    >
      {children}
    </div>
  );
};

export const DrawerHeader = ({ children, className, ...restProps }: CommonDrawerProps) => {
  const { getDrawerHeaderProps } = useDrawerContext();

  return (
    <header
      className={cx(DRAWER_HEADER_CLASS, className)}
      {...getDrawerHeaderProps()}
      {...restProps}
    >
      {children}
    </header>
  );
};

export const DrawerHeaderTitle = ({ children, className }: CommonDrawerProps) => {
  return (
    <Title tag="h3" className={cx(DRAWER_HEADER_TITLE_CLASS, className)}>
      {children}
    </Title>
  );
};

export const DrawerCloseButton = React.forwardRef<HTMLElement, DrawerCloseButtonProps>(
  ({ className, iconProps, 'aria-label': ariaLabel = 'Close drawer', ...restProps }, ref) => {
    const { getDrawerCloseButtonProps } = useDrawerContext();

    return (
      <IconControl
        name="close"
        {...getDrawerCloseButtonProps()}
        className={cx(DRAWER_CLOSE_BUTTON_CLASS, className)}
        aria-label={ariaLabel}
        ref={ref}
        {...iconProps}
        {...restProps}
      />
    );
  }
);

export const DrawerBody = ({ children, className, ...restProps }: CommonDrawerProps) => {
  const { getDrawerBodyProps } = useDrawerContext();

  return (
    <div {...getDrawerBodyProps()} className={cx(DRAWER_BODY_CLASS, className)} {...restProps}>
      {children}
    </div>
  );
};

export const DrawerFooter = ({ children, className, ...restProps }: CommonDrawerProps) => {
  return (
    <footer className={cx(DRAWER_FOOTER_CLASS, className)} {...restProps}>
      {children}
    </footer>
  );
};
