import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Box } from './Box';
import { UI_PREFIX } from '../../config';

describe('Box component', () => {
  test('renders Box', () => {
    render(
      <Box className="extra-class" header="Box Title" data-testid="box-container">
        Text here
      </Box>
    );

    expect(screen.getByTestId('box-container')).toHaveClass(`${UI_PREFIX}__box extra-class`);
    expect(screen.getByText('Text here')).toHaveClass(`${UI_PREFIX}__box__content`);
    expect(screen.getByText('Box Title')).toHaveClass(`${UI_PREFIX}__box__header`);
  });

  test('renders Box icons', () => {
    render(
      <Box className="extra-class" showIcon={true} variant="warning">
        Text here
      </Box>
    );

    const icon = screen.getByLabelText('box-warning-icon');
    expect(icon).toHaveClass('warning_amber');
  });

  test('minimize icon toggles the content', async () => {
    render(<Box showMinimize>Mighty Content</Box>);

    expect(screen.getByText('Mighty Content')).not.toHaveClass(
      `${UI_PREFIX}__box__content--minimized`
    );

    const icon = screen.getByLabelText('box-toggle-minimize-icon');
    await userEvent.click(icon);

    expect(screen.getByText('Mighty Content')).toHaveClass(`${UI_PREFIX}__box__content--minimized`);
  });

  test('shows a close icon and calls onClose function', async () => {
    const mockFn = jest.fn();
    render(
      <Box showClose onCloseClick={() => mockFn()}>
        Mighty Content
      </Box>
    );

    const icon = screen.getByLabelText('box-close-icon');
    await userEvent.click(icon);

    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});
