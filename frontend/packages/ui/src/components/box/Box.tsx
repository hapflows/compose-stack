import React, { useState } from 'react';

import { UI_PREFIX } from '../../config';
import { cx } from '../../utils/classNames';
import { Icon } from '../icon/Icon';

import { BoxProps, BoxVariantType } from './Box.types';

const BOX_CLASS = `${UI_PREFIX}__box`;
const BOX_HEADER_CLASS = `${BOX_CLASS}__header`;
const BOX_BODY_CLASS = `${BOX_CLASS}__body`;
const BOX_SIDE_CLASS = `${BOX_CLASS}__side`;
const BOX_ICON_CONTAINER_CLASS = `${BOX_CLASS}__icon-container`;
const BOX_CONTENT_CLASS = `${BOX_CLASS}__content`;
const BOX_CONTENT_MINIMIZED_CLASS = `${BOX_CLASS}__content--minimized`;
// Variant will be generated:
// ${BOX_CLASS}--${variant}

const ICONS: { [variant in BoxVariantType]: string } = {
  info: 'info_outline',
  warning: 'warning_amber',
  none: '',
  success: 'check_circle_outline',
  error: 'close',
};

export function Box({
  children,
  header,
  className,
  shadowed,
  showIcon,
  showClose = false,
  onCloseClick,
  showMinimize = false,
  variant = 'none',
  ...rest
}: BoxProps) {
  const [minimized, setMinimized] = useState(false);
  const boxClassName = cx(BOX_CLASS, className, {
    [`${BOX_CLASS}--${variant}`]: variant !== 'none',
    [`${BOX_CLASS}--shadowed`]: shadowed,
  });
  const iconContainerClassName = cx(BOX_ICON_CONTAINER_CLASS, {
    [`${BOX_ICON_CONTAINER_CLASS}--${variant}`]: variant !== 'none',
  });
  const iconName = ICONS[variant];

  return (
    <div className={boxClassName} {...rest}>
      <div className={BOX_BODY_CLASS}>
        {showIcon && (
          <div className={BOX_SIDE_CLASS}>
            <div className={iconContainerClassName}>
              <Icon name={iconName} size="sm" aria-label={`box-${variant}-icon`} />
            </div>
          </div>
        )}
        <div className={cx(BOX_CONTENT_CLASS, { [BOX_CONTENT_MINIMIZED_CLASS]: minimized })}>
          <div className={BOX_HEADER_CLASS}>{header}</div>
          {children}
        </div>
        {showClose && onCloseClick && (
          <div className={BOX_SIDE_CLASS} onClick={onCloseClick}>
            <Icon name="close" size="xs" className="cursor-pointer" aria-label="box-close-icon" />
          </div>
        )}
        {showMinimize && (
          <div className={BOX_SIDE_CLASS} onClick={() => setMinimized((m) => !m)}>
            <Icon
              name={minimized ? 'open_in_full' : 'close_fullscreen'}
              size="xs"
              className="cursor-pointer"
              aria-label="box-toggle-minimize-icon"
            />
          </div>
        )}
      </div>
    </div>
  );
}
