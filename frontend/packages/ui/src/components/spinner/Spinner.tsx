import React from 'react';
import { UI_PREFIX } from '../../config';
import { cx } from '../../utils/classNames';
import { SpinnerProps } from './Spinner.types';

const SPINNER_CLASS = `${UI_PREFIX}__spinner`;

export const Spinner = ({ size = 'md', className = '', ...rest }: SpinnerProps) => {
  const spinnerClasses = cx(
    SPINNER_CLASS,
    {
      [`${SPINNER_CLASS}--lg`]: size === 'lg',
      [`${SPINNER_CLASS}--md`]: size === 'md',
      [`${SPINNER_CLASS}--sm`]: size === 'sm',
      [`${SPINNER_CLASS}--xs`]: size === 'xs',
    },
    className
  );
  return (
    <div className={spinnerClasses} {...rest}>
      <span className={`${SPINNER_CLASS}__text`}>Loading</span>
    </div>
  );
};
