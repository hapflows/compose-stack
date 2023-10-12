import React from 'react';

import { UI_PREFIX } from '../../../config';
import { cx } from '../../../utils/classNames';
import { TextareaProps } from './Textarea.types';

const FORM_TEXTAREA_CLASS = `${UI_PREFIX}__form__field__textarea`;
const FORM_TEXTAREA_DISABLED_CLASS = `${UI_PREFIX}__form__field__textarea--disabled`;
const FORM_TEXTAREA_INVALID_CLASS = `${UI_PREFIX}__form__field__textarea--invalid`;
const FORM_TEXTAREA_MAX_LENGTH_CLASS = `${UI_PREFIX}__form__field__textarea__max-length`;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', disabled, invalid, value, maxLength, showLength, ...rest }, ref) => {
    const textareaClassName = cx(FORM_TEXTAREA_CLASS, className, {
      [FORM_TEXTAREA_DISABLED_CLASS]: disabled,
      [FORM_TEXTAREA_INVALID_CLASS]: invalid,
    });

    const characterCount = maxLength || showLength ? (value || '').length : 0;

    return (
      <div style={{ width: '100%', height: '100%' }}>
        <textarea
          className={textareaClassName}
          disabled={disabled}
          maxLength={maxLength}
          {...rest}
          ref={ref}
          value={value || ''}
        />
        {(showLength || maxLength) && (
          <div className={FORM_TEXTAREA_MAX_LENGTH_CLASS}>
            {characterCount}
            {maxLength ? `/${maxLength}` : ''}
          </div>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
