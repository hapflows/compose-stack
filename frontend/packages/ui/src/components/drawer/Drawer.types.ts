import React from 'react';
import { SizesType } from '../../utils/sharedTypes';
import { IconControlProps } from '../icon/IconControl.types';
import { Options as FocusTrapOptions } from 'focus-trap';

import { useDrawer } from './useDrawer';

export type UseDrawerReturnType = ReturnType<typeof useDrawer>;

export interface DrawerOptions {
  /** If true, the drawer will not be rendered in a portal.
   * @default false
   */
  disablePortal?: boolean;
  /** If true, there will be no transition on the drawer.
   * @default false
   */
  disableTransition?: boolean;
  /**
   * If true, the body will not be locked when the drawer is active.
   * @default false
   */
  disableLockScroll?: boolean;
  /**
   * Options to pass to the focus trap.
   */
  focusTrapOptions?: FocusTrapOptions;
  /**
   * HTML Element to be focused initally when the drawer unmounts.
   */
  finalFocusRef?: React.RefObject<HTMLElement>;
  /** If true, the content will not be unmounted when closed. Useful for SEO.
   * @default false
   */
  keepMounted?: boolean;
  /**
   * HTML Element to be focused initally when the drawer mounts.
   */
  initialFocusRef?: React.RefObject<HTMLElement>;
  /**
   * Uses a different ID for the root div.
   */
  rootId?: string;
  /**
   * If passed and portal is not disabled,
   * will render the drawer inside a form instead of a div.
   */
  formProps?: any;
  /**
   * Function to run when drawer begins entering.
   */
  onEnter?: () => void;
  /**
   * Function to run when drawer has entered.
   */
  onEntered?: () => void;
  /**
   * Function to run when drawer begins exiting.
   */
  onExit?: () => void;
  /**
   * Function to run when drawer has exited.
   */
  onExited?: () => void;
  /**
   * If true, focus will not be locked inside the drawer. Not recommended.
   * @default `false``
   */
  removeFocusLock?: boolean;
  /**
   * Class for `react-transition-group` to add classes for transitions.
   * See more: https://reactcommunity.org/react-transition-group/css-transition
   * @default `compose-stack-ui-drawer`
   */
  transitionClassName?: string;
  /**
   * The size of the rendered drawer.
   * @default `md`
   */
  size?: SizesType | 'full';
}

export type DrawerContextType = UseDrawerReturnType &
  Pick<DrawerOptions, 'size' | 'initialFocusRef'>;

export interface UseDrawerProps {
  /** If true, the user can not close the drawer by pressing Esc or clicking the overlay.
   * @default false
   */
  disableClose?: boolean;
  /**
   * If true, the user can not close the drawer when clicking on the drawer overlay.
   * @default false
   */
  disableCloseOnOverlayClick?: boolean;
  /**
   * If true, the drawer will be open.
   * @default false
   */
  isOpen?: boolean;
  /**
   * ID for the drawer. Used to add `aria` attributes to children components for accessibility.
   * @default `compose-stack-ui-drawer`
   */
  drawerId?: string;
  /**
   * Function to run when drawer is closed.
   */
  onClose?: () => void;
}

export type CommonDrawerProps = {
  children: React.ReactNode;
  /** For CSS customisation */
  className?: string;
};

export interface DrawerWrapperProps
  extends Omit<UseDrawerProps, 'ref'>,
    CommonDrawerProps,
    DrawerOptions {}

export interface DrawerContainerProps extends CommonDrawerProps {
  /**
   * For CSS customisation of the overlay.
   */
  overlayClassName?: string;
}

export interface DrawerPortalProps extends CommonDrawerProps {
  /**
   * Uses a different div as root.
   */
  rootId?: string;
}

export interface DrawerCloseButtonProps
  extends Omit<CommonDrawerProps, 'children'>,
    Partial<Omit<IconControlProps, 'ref'>> {}

export interface DrawerProps
  extends Omit<DrawerWrapperProps, 'children'>,
    Pick<DrawerContainerProps, 'overlayClassName'> {
  /** For CSS customisation of `DrawerBody` */
  bodyClassName?: string;
  /** Content to be displayed in `DrawerBody` */
  bodyContent?: React.ReactNode;
  children?: React.ReactNode;
  /** Props to be forwarded to `DrawerCloseButton` */
  closeButtonProps?: DrawerCloseButtonProps;
  /** For CSS customisation of `DrawerContainer` */
  containerClassName?: string;
  /** For CSS customisation of `DrawerDialog` */
  dialogClassName?: string;
  /** For CSS customisation of`DrawerFooter */
  footerClassName?: string;
  /** Content to be displayed in `DrawerFooter`, which has a `footer` tag. */
  footerContent?: React.ReactNode;
  /** For CSS customisation  of `DrawerHeader` */
  headerClassName?: string;
  /** Content to be displayed in `DrawerHeader`, which has a `header` tag. */
  headerContent?: React.ReactNode;
  /** For CSS customisation  of `DrawerHeader` -> `Title` */
  headerTitleClassName?: string;
  /** If true, the `DrawerCloseButton` will be hidden.
   * @default `false`.
   */
  hideCloseButton?: boolean;
}
