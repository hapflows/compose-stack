import React from 'react';
import { render, screen } from '@testing-library/react';

import { UI_PREFIX } from '../../config';

import { Loader } from './Loader';

describe('Loader', () => {
  test('renders triangle loader', () => {
    render(<Loader data-testid="loader-container" className="test-class" />);

    const loader = screen.getByTestId('loader-container');
    expect(loader).toHaveClass(`${UI_PREFIX}__loader-container`);
    expect(loader).toHaveClass(`${UI_PREFIX}__loader-container--triangle`);
    expect(loader).toHaveClass(`test-class`);
  });

  test('renders line loader', () => {
    render(<Loader type="line" data-testid="loader-container" />);

    const loader = screen.getByTestId('loader-container');
    expect(loader).toHaveClass(`${UI_PREFIX}__loader-container`);
    expect(loader).toHaveClass(`${UI_PREFIX}__loader-container--line`);
  });

  test('renders inline loader', () => {
    render(<Loader type="inline" data-testid="loader-container" />);

    const loader = screen.getByTestId('loader-container');
    expect(loader).toHaveClass(`${UI_PREFIX}__loader-container`);
    expect(loader).toHaveClass(`${UI_PREFIX}__loader-container--inline`);
  });
});
