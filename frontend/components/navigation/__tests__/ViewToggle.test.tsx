import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ViewToggle } from '../ViewToggle';

describe('ViewToggle', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders with default view', () => {
    render(
      <ViewToggle
        view="grid"
        onChange={mockOnChange}
      />
    );

    const gridButton = screen.getByRole('button', { name: /grid view/i });
    const listButton = screen.getByRole('button', { name: /list view/i });

    expect(gridButton).toHaveAttribute('aria-pressed', 'true');
    expect(listButton).toHaveAttribute('aria-pressed', 'false');
  });

  it('calls onChange when view is toggled', () => {
    render(
      <ViewToggle
        view="grid"
        onChange={mockOnChange}
      />
    );

    const listButton = screen.getByRole('button', { name: /list view/i });
    fireEvent.click(listButton);

    expect(mockOnChange).toHaveBeenCalledWith('list');
  });

  it('applies custom className when provided', () => {
    const customClass = 'custom-class';
    render(
      <ViewToggle
        view="grid"
        onChange={mockOnChange}
        className={customClass}
      />
    );

    const container = screen.getByRole('group');
    expect(container).toHaveClass(customClass);
  });

  it('handles keyboard navigation', () => {
    render(
      <ViewToggle
        view="grid"
        onChange={mockOnChange}
      />
    );

    const gridButton = screen.getByRole('button', { name: /grid view/i });
    const listButton = screen.getByRole('button', { name: /list view/i });

    // Test keyboard navigation
    gridButton.focus();
    fireEvent.keyDown(gridButton, { key: 'ArrowRight' });
    expect(listButton).toHaveFocus();

    fireEvent.keyDown(listButton, { key: 'ArrowLeft' });
    expect(gridButton).toHaveFocus();

    // Test selection with Enter key
    fireEvent.keyDown(listButton, { key: 'Enter' });
    expect(mockOnChange).toHaveBeenCalledWith('list');
  });
});
