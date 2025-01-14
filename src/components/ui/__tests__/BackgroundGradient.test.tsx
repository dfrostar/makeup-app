import React from 'react';
import { render, screen } from '@testing-library/react';
import { BackgroundGradient } from '../BackgroundGradient';

describe('BackgroundGradient', () => {
  it('renders children with gradient background', () => {
    render(
      <BackgroundGradient>
        <div data-testid="test-content">Test Content</div>
      </BackgroundGradient>
    );

    const content = screen.getByTestId('test-content');
    expect(content).toBeInTheDocument();
    expect(content.textContent).toBe('Test Content');
  });

  it('applies custom className when provided', () => {
    const customClass = 'custom-class';
    render(
      <BackgroundGradient className={customClass}>
        <div>Test Content</div>
      </BackgroundGradient>
    );

    const container = screen.getByText('Test Content').parentElement;
    expect(container).toHaveClass(customClass);
  });

  it('forwards additional props to the container', () => {
    render(
      <BackgroundGradient data-testid="gradient" aria-label="background">
        <div>Test Content</div>
      </BackgroundGradient>
    );

    const container = screen.getByTestId('gradient');
    expect(container).toHaveAttribute('aria-label', 'background');
  });

  it('renders with default styles', () => {
    render(
      <BackgroundGradient>
        <div>Test Content</div>
      </BackgroundGradient>
    );

    const container = screen.getByText('Test Content').parentElement;
    expect(container).toHaveClass('bg-gradient-to-r');
  });
});
