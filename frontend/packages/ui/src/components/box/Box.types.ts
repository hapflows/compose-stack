import { ReactNode } from 'react';

export type BoxVariantType = 'none' | 'info' | 'warning' | 'success' | 'error';

export interface BoxProps
  extends React.PropsWithChildren<React.ComponentPropsWithoutRef<React.ElementType>> {
  header?: ReactNode;
  variant?: BoxVariantType;
  className?: string;
  /** Apply a small shadow */
  shadowed?: boolean;
  showIcon?: boolean;
  showClose?: boolean;
  onCloseClick?: () => void;
  showMinimize?: boolean;
}
