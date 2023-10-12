import React from 'react';
import { render, screen } from '@testing-library/react';

import { Text } from './Text';
import { Title } from './Title';
import { UI_PREFIX } from '../../config';

describe('text components', () => {
  test('renders Text', () => {
    render(<Text className="extra-class">Text here</Text>);

    expect(screen.getByText('Text here')).toHaveClass(`${UI_PREFIX}__text`);
    expect(screen.getByText('Text here')).toHaveClass(`extra-class`);

    render(<Text tag="span">As span</Text>);
    expect(screen.getByText('As span', { selector: 'span' })).toBeInTheDocument();

    render(<Text size="big">Big one</Text>);
    expect(screen.getByText('Big one')).toHaveClass(`${UI_PREFIX}__text--big`);
    render(<Text size="small">Small one</Text>);
    expect(screen.getByText('Small one')).toHaveClass(`${UI_PREFIX}__text--small`);
  });

  test('renders Title', () => {
    render(<Title>I am title</Title>);
    expect(screen.getByText('I am title')).toHaveClass(`${UI_PREFIX}__title`);

    render(<Title tag="h2">Smaller</Title>);
    expect(screen.getByText('Smaller', { selector: 'h2' })).toBeInTheDocument();

    render(<Title className="extra-class">Double class</Title>);
    expect(screen.getByText('Double class')).toHaveClass(`${UI_PREFIX}__title`);
    expect(screen.getByText('Double class')).toHaveClass('extra-class');

    // Anchor
    render(<Title anchor="here">Anchor</Title>);
    expect(screen.getByText('Anchor')).toHaveClass(`${UI_PREFIX}__title__anchor`);
    // Custom Anchor class
    render(
      <Title anchor="here" anchorClassName="my-class">
        Anchor Class
      </Title>
    );
    expect(screen.getByText('Anchor Class')).toHaveClass(`my-class`);
  });
});
