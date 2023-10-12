import React from 'react';
import { SizesType, TagType } from '../../utils/sharedTypes';

type VARIANTS_NORMAL =
  | 'primary'
  | 'secondary'
  | 'gradient'
  | 'positive'
  | 'negative'
  | 'warning'
  | 'accent'
  | 'neutral'
  | 'neutral-dark';
type VARIANTS_OUTLINE = `${VARIANTS_NORMAL}-outline`;

type ButtonVariants = VARIANTS_NORMAL | VARIANTS_OUTLINE;

export type ButtonSizes = Extract<SizesType, 'lg' | 'md' | 'sm' | 'xs'>;

export type ButtonRef = HTMLButtonElement;
export interface ButtonProps extends Omit<React.HTMLProps<HTMLButtonElement>, 'size' | 'onClick'> {
  children: React.ReactNode;
  /** For CSS customisation */
  className?: string;
  /** If true, the button will be disabled */
  isDisabled?: boolean;
  /** If true, the button will show a spinner */
  isLoading?: boolean;
  /** Icon to be displayed to the left of the label */
  leftIcon?: React.ReactElement;
  /** Function to run on click */
  onClick?: (e: any) => void;
  /** Icon to be displayed to the right of the label */
  rightIcon?: React.ReactElement;
  /** Add a background light color */
  lightBackground?: boolean;
  /** Render without border */
  borderless?: boolean;
  /** Change the size of the button. Defaults to `md` */
  size?: ButtonSizes;
  /** For CSS customisation of the spinner that is displayed when isLoading is true */
  loaderClassName?: string;
  /** Change the placement of the spinner. Defaults to `left` */
  loaderPlacement?: 'left' | 'right' | 'start' | 'end';
  /** Use a different tag from `button` */
  tag?: TagType;
  /** Change the variant of the button. Defaults to `filled` */
  variant?: ButtonVariants;
}

export type ButtonContentProps = Pick<
  ButtonProps,
  'leftIcon' | 'rightIcon' | 'children' | 'isLoading'
>;

export type ButtonIconProps = Pick<ButtonProps, 'children'> & {
  position: 'left' | 'right';
};
