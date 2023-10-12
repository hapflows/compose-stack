import React, { forwardRef, ForwardRefRenderFunction } from 'react';

import { UI_PREFIX } from '../../../config';
import { cx } from '../../../utils/classNames';
import { Icon } from '../../icon/Icon';

import { InputProps } from './Input.types';

export const INPUT_CLASS = `${UI_PREFIX}__input`;
export const INPUT_GROUP_CLASS = `${INPUT_CLASS}__group`;
export const INPUT_ICON_CLASS = `${INPUT_CLASS}__icon`;
export const INPUT_ICON_DISABLED_CLASS = `${INPUT_CLASS}__icon--disabled`;
export const INPUT_TEXTBOX_CLASS = `${INPUT_CLASS}__textbox`;
export const INPUT_HELPER_CLASS = `${INPUT_CLASS}__helper`;

export const InputInner: ForwardRefRenderFunction<HTMLInputElement, InputProps> = (
  {
    className,
    id,
    type = 'text',
    disabled,
    invalid,
    readonly,
    required,
    placeholder,
    leftIconProps = {},
    rightIconProps = {},
    size = 'md',
    ...rest
  },
  ref
) => {
  const hasLeftIcon = leftIconProps?.name && size !== 'xs';
  const hasRightIcon = rightIconProps?.name && size !== 'xs';

  const textboxClassNames = cx(
    INPUT_TEXTBOX_CLASS,
    `${INPUT_TEXTBOX_CLASS}--${size}`,
    {
      [`${INPUT_TEXTBOX_CLASS}--disabled`]: disabled,
      [`${INPUT_TEXTBOX_CLASS}--invalid`]: invalid,
      [`${INPUT_TEXTBOX_CLASS}--readonly`]: readonly,
      [`${INPUT_TEXTBOX_CLASS}--left-icon`]: hasLeftIcon,
      [`${INPUT_TEXTBOX_CLASS}--right-icon`]: hasRightIcon,
    },
    className
  );

  const { className: leftIconClass, ...restLeftIconProps } = leftIconProps;
  const { className: rightIconClass, ...restRightIconProps } = rightIconProps;

  const leftIconClassName = cx(INPUT_ICON_CLASS, `${INPUT_ICON_CLASS}--left`, leftIconClass, {
    [INPUT_ICON_DISABLED_CLASS]: disabled,
  });
  const rightIconClassName = cx(INPUT_ICON_CLASS, `${INPUT_ICON_CLASS}--right`, rightIconClass, {
    [INPUT_ICON_DISABLED_CLASS]: disabled,
  });

  return (
    <div className={INPUT_CLASS}>
      <div className={INPUT_GROUP_CLASS}>
        {hasLeftIcon && <Icon size="md" className={leftIconClassName} {...restLeftIconProps} />}
        <input
          {...(disabled && { 'aria-disabled': true })}
          {...(invalid && { 'aria-invalid': true })}
          {...(readonly && { 'aria-readonly': true })}
          {...(required && { 'aria-required': true })}
          className={textboxClassNames}
          disabled={disabled}
          placeholder={placeholder}
          readOnly={readonly}
          id={id}
          ref={ref}
          type={type}
          {...rest}
        />
        {hasRightIcon && <Icon size="md" className={rightIconClassName} {...restRightIconProps} />}
      </div>
    </div>
  );
};

export const Input = forwardRef(InputInner);

Input.displayName = 'Input';
