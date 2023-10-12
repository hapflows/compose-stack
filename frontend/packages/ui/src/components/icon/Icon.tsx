import React from 'react';

import { a11yClickableElement } from '../../utils/a11y';
import { UI_PREFIX } from '../../config';
import { cx } from '../../utils/classNames';
import { IconProps } from './Icon.types';

export const ICON_DEFAULT_FAMILY = 'material-icons';

const ICON_CLASS = `${UI_PREFIX}__icon`;
/*
Sizes: `${UI_PREFIX}__icon--smaller`
Modifiers: `${UI_PREFIX}__icon--${modifier}` (see IconProps for modifiers)
*/

export const Icon = React.forwardRef<HTMLElement, IconProps>(
  (
    {
      name,
      family = ICON_DEFAULT_FAMILY,
      size = 'md',
      modifiers = [],
      className = '',
      onClick,
      ...rest
    },
    ref
  ): JSX.Element => {
    const sizeClass = `${ICON_CLASS}--${size}`;

    const modifiersList = Array.isArray(modifiers) ? modifiers : [modifiers];
    if (onClick && !modifiersList.includes('clickable')) modifiersList.push('clickable');

    const modifiersClasses = modifiersList.map((m) => `${ICON_CLASS}--${m}`).join(' ');

    const iconClassName = cx(ICON_CLASS, family, name, modifiersClasses, sizeClass, className);
    const onClickProps = onClick ? a11yClickableElement({ onClick, role: 'button' }) : {};
    return <i className={iconClassName} {...onClickProps} ref={ref} {...rest} />;
  }
);

Icon.displayName = 'Icon';
