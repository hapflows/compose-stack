import React from 'react';
import { SizesType } from '../../../utils/sharedTypes';
import { IconProps } from '../../icon/Icon.types';

type BaseHTMLInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>;

export interface InputStates {
  /**
   * If true, the input will be disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * If true, the input will be invalid.
   * @default false
   */
  invalid?: boolean;
  /**
   * If true, the input will be readonly.
   * @default false
   */
  readonly?: boolean;
  /**
   * If true, the input will be required.
   * @default false
   */
  required?: boolean;
}
export type InputTypes = 'text' | 'email' | 'password' | 'search' | 'date' | 'time' | 'number';

export interface InputProps extends BaseHTMLInputProps, InputStates {
  /**
   * For CSS customisation
   */
  className?: string;
  /**
   * ID for the input
   */
  id?: string;
  /**
   * type for the input
   */
  type?: InputTypes;
  /**
   * Icon to be displayed on the left of the input
   */
  leftIconProps?: IconProps;
  /**
   * Icon to be displayed on the left of the input
   */
  rightIconProps?: IconProps;
  /**
   * Size of the rendered input.
   * @default md
   */
  size?: SizesType | 'xl';
}
