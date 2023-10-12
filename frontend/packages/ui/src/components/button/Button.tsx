import * as React from 'react';
import { UI_PREFIX } from '../../config';
import { cx } from '../../utils/classNames';
import { Spinner } from '../spinner/Spinner';
import { ButtonContentProps, ButtonIconProps, ButtonProps, ButtonRef } from './Button.types';

const BUTTON_CLASS = `${UI_PREFIX}__button`;
const ICON_CLASS = `${BUTTON_CLASS}__icon`;
const LOADER_CLASS = `${BUTTON_CLASS}__loader`;
const BUTTON_CONTENT_CLASS = `${UI_PREFIX}__button__content`;

export const Button = React.forwardRef<ButtonRef, ButtonProps>(
  (
    {
      children,
      className = '',
      isDisabled,
      isLoading,
      leftIcon,
      onClick,
      rightIcon,
      lightBackground,
      borderless,
      size = 'md',
      loaderClassName = '',
      loaderPlacement = 'left',
      tag: Tag = 'button',
      type = 'button',
      variant = 'neutral',
      ...restProps
    },
    ref
  ) => {
    const buttonContentProps = { leftIcon, rightIcon, children, isLoading };

    const buttonClasses = cx(
      BUTTON_CLASS,
      `${BUTTON_CLASS}--${variant}`,
      {
        [`${BUTTON_CLASS}--lg`]: size === 'lg',
        [`${BUTTON_CLASS}--md`]: size === 'md',
        [`${BUTTON_CLASS}--sm`]: size === 'sm',
        [`${BUTTON_CLASS}--xs`]: size === 'xs',
        [`${BUTTON_CLASS}--borderless`]: borderless,
        [`${BUTTON_CLASS}--light-background`]: lightBackground,
      },
      className
    );

    const loaderClasses = cx(
      LOADER_CLASS,
      {
        [`${LOADER_CLASS}--left`]: loaderPlacement === 'left' || loaderPlacement === 'start',
        [`${LOADER_CLASS}--right`]: loaderPlacement === 'right' || loaderPlacement === 'end',
      },
      loaderClassName
    );

    return (
      <Tag
        ref={ref}
        className={buttonClasses}
        disabled={isDisabled || isLoading}
        onClick={onClick}
        type={Tag === 'button' ? type : undefined}
        aria-disabled={isDisabled || isLoading ? true : null}
        {...restProps}
      >
        {isLoading && (loaderPlacement === 'left' || loaderPlacement === 'start') && (
          <Spinner className={loaderClasses} />
        )}

        <ButtonContent {...buttonContentProps} />

        {isLoading && (loaderPlacement === 'right' || loaderPlacement === 'end') && (
          <Spinner className={loaderClasses} />
        )}
      </Tag>
    );
  }
);
Button.displayName = 'Button';

const ButtonContent = ({ leftIcon, rightIcon, children, isLoading }: ButtonContentProps) => {
  return (
    <>
      {leftIcon && !isLoading ? <ButtonIcon position="left">{leftIcon}</ButtonIcon> : null}
      <div className={BUTTON_CONTENT_CLASS}>{children}</div>
      {rightIcon && !isLoading ? <ButtonIcon position="right">{rightIcon}</ButtonIcon> : null}
    </>
  );
};

const ButtonIcon = ({ children, position }: ButtonIconProps) => {
  const iconClasses = cx(ICON_CLASS, {
    [`${ICON_CLASS}--left`]: position === 'left',
    [`${ICON_CLASS}--right`]: position === 'right',
  });

  return <span className={iconClasses}>{children}</span>;
};
