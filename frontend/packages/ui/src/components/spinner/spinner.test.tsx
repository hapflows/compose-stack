import React from 'react';
import { render, screen } from '@testing-library/react';
import { Spinner } from './Spinner';
import { UI_PREFIX } from '../../config';

const SPINNER_CLASS = `${UI_PREFIX}__spinner`;

describe('Spinner', () => {
  test('the spinner renders correctly', () => {
    render(<Spinner data-testid="spinner" />);

    const spinner = screen.getByTestId(/spinner/i);
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass(`${SPINNER_CLASS}`);

    const spinnerText = screen.getByText(/loading/i);
    expect(spinnerText).toBeInTheDocument();
  });
});
