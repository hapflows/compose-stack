import React from 'react';
import '../../utils/mocks/match-media.mock';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  test('renders text correctly', () => {
    render(<Button>Click me</Button>);

    const button = selectButton();
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(/click me/i);
  });

  test('it accepts an onClick prop, and is called when the button is clicked', async () => {
    const mockFn = jest.fn();
    render(<Button onClick={() => mockFn()}>Click me</Button>);

    const button = selectButton();

    await userEvent.click(button);

    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test('when disabled, the user clicking the button has no effect', async () => {
    const mockFn = jest.fn();
    render(
      <Button isDisabled onClick={() => mockFn()}>
        Click me
      </Button>
    );

    const button = selectButton();
    expect(button).toBeDisabled();

    await userEvent.click(button);

    expect(mockFn).not.toHaveBeenCalled();
  });

  test('when isLoading prop is passed, the button is disabled, a spinner shows and and the user cannot click again', async () => {
    const mockFn = jest.fn();
    render(
      <Button isLoading onClick={mockFn}>
        Click me
      </Button>
    );

    const button = screen.getByRole('button', { name: /click me/i });
    const spinner = screen.getByText(/loading/i);

    expect(spinner).toBeInTheDocument();
    expect(button).toHaveTextContent(/click me/i);
    expect(button).toBeDisabled();

    await userEvent.click(button);
    expect(mockFn).not.toHaveBeenCalled();
  });

  test('renders a custom tag when passed using the tag prop', () => {
    render(
      <Button tag="a" href="https://www.example.com">
        Click me
      </Button>
    );

    const button = screen.getByRole('link');
    expect(button).toHaveAttribute('href', 'https://www.example.com');
  });

  test('when button type is set to submit, it can submit a form', async () => {
    const mockSubmitFn = jest.fn((e) => e.preventDefault());
    render(
      <form onSubmit={mockSubmitFn}>
        <Button type="submit">Click me</Button>
      </form>
    );

    const button = selectButton();
    await userEvent.click(button);

    expect(mockSubmitFn).toHaveBeenCalled();
  });

  test('the button accepts extra components in the leftIcon and rightIcon props', () => {
    render(
      <Button leftIcon={<span role="presentation" />} rightIcon={<span role="presentation" />}>
        Click me
      </Button>
    );

    const icons = screen.getAllByRole('presentation');
    expect(icons).toHaveLength(2);
  });
});

const selectButton = () => screen.getByRole('button', { name: /click me/i });
