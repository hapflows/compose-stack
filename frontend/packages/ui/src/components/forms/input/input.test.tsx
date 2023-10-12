import '../../../utils/mocks/match-media.mock';

import React, { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Input } from './Input';
import { InputProps } from './Input.types';
import { ICON_DEFAULT_FAMILY } from '../../icon/Icon';

const INPUT_ID = 'input_test';

const FormComponent = (props: InputProps) => {
  const [text, setText] = useState('');

  return (
    <div>
      <Input id={INPUT_ID} onChange={(e: any) => setText(e.target.value)} value={text} {...props} />
      <h1>{text}</h1>
    </div>
  );
};

describe('Input', () => {
  test('the input renders and functions', async () => {
    render(<FormComponent />);

    const inputText = screen.getByRole('textbox');
    const textElement = screen.getByRole('heading');

    const newValue = 'this is the content';

    expect(inputText).toBeInTheDocument();
    expect(textElement).toHaveTextContent('');

    await userEvent.type(inputText, newValue);

    expect(textElement).toHaveTextContent(newValue);
  });

  test('the input accepts extra components in the leftIcon and rightIcon props', () => {
    render(
      <FormComponent
        leftIconProps={{ name: 'add', 'aria-label': 'leftIcon' }}
        rightIconProps={{ name: 'edit', size: 'lg', 'aria-label': 'rightIcon' }}
      />
    );

    const leftIcon = screen.getByLabelText('leftIcon');
    const rightIcon = screen.getByLabelText('rightIcon');

    expect(leftIcon).toBeInTheDocument();
    expect(rightIcon).toBeInTheDocument();

    expect(leftIcon).toHaveClass('add');
    expect(rightIcon).toHaveClass(ICON_DEFAULT_FAMILY);
  });

  test('the input can be disabled', async () => {
    render(<FormComponent disabled />);

    const inputText = screen.getByRole('textbox');
    expect(inputText).toBeDisabled();
    expect(inputText).toHaveAttribute('aria-disabled', 'true');
  });

  test('the input can be readonly', async () => {
    render(<FormComponent readonly />);

    const inputText = screen.getByRole('textbox');
    expect(inputText).toHaveValue('');

    await userEvent.type(inputText, 'this is the content');

    expect(inputText).toHaveValue('');
    expect(inputText).toHaveAttribute('aria-readonly', 'true');
  });

  test('the input can be invalid', async () => {
    render(<FormComponent invalid />);

    const inputText = screen.getByRole('textbox');

    expect(inputText).toBeInvalid();
    expect(inputText).toHaveAttribute('aria-invalid', 'true');
  });

  test('the input can be required', async () => {
    render(<FormComponent required />);

    const inputText = screen.getByRole('textbox');

    expect(inputText).toBeRequired();
  });
});
