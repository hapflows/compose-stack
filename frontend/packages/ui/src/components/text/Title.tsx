import React from 'react';

import { UI_PREFIX } from '../../config';
import { cx } from '../../utils/classNames';
import { TitleProps } from './Title.types';

const TITLE_CLASS = `${UI_PREFIX}__title`;
const TITLE_STICKY_CLASS = `${UI_PREFIX}__title--sticky`;
const TITLE_ANCHOR_CLASS = `${UI_PREFIX}__title__anchor`;

export const Title = ({
  anchor,
  anchorClassName = '',
  tag: Tag = 'h1',
  children,
  className = '',
  isSticky,
  ...rest
}: TitleProps): JSX.Element => {
  const titleClassName = cx(TITLE_CLASS, { [TITLE_STICKY_CLASS]: isSticky }, className);

  const anchorClass = cx(TITLE_ANCHOR_CLASS, anchorClassName);
  const content = anchor ? (
    <a className={anchorClass} id={anchor} href={`#${anchor}`}>
      {children}
    </a>
  ) : (
    children
  );

  return (
    <Tag className={titleClassName} {...rest}>
      {content}
    </Tag>
  );
};
