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
        currentView="grid"
        onChange={mockOnChange}
      />
    );

    const discoveryButton = screen.getByRole('button', { name: /discovery/i });
    const directoryButton = screen.getByRole('button', { name: /directory/i });

    expect(discoveryButton).toHaveAttribute('aria-pressed', 'true');
    expect(directoryButton).toHaveAttribute('aria-pressed', 'false');
  });

  it('calls onChange when view is toggled', () => {
    render(
      <ViewToggle
        currentView="grid"
        onChange={mockOnChange}
      />
    );

    const directoryButton = screen.getByRole('button', { name: /directory/i });
    fireEvent.click(directoryButton);

    expect(mockOnChange).toHaveBeenCalledWith('list');
  });

  it('handles view toggle correctly', () => {
    render(
      <ViewToggle
        currentView="grid"
        onChange={mockOnChange}
      />
    );

    const directoryButton = screen.getByRole('button', { name: /directory/i });
    fireEvent.click(directoryButton);

    expect(mockOnChange).toHaveBeenCalledWith('list');
  });

  it('applies custom className when provided', () => {
    const customClass = 'custom-toggle';
    render(
      <ViewToggle
        currentView="grid"
        onChange={() => {}}
        className={customClass}
      />
    );

    const container = screen.getByTestId('view-toggle-container');
    expect(container).toHaveClass(customClass);
  });

  it('handles keyboard navigation', () => {
    render(
      <ViewToggle
        currentView="grid"
        onChange={mockOnChange}
      />
    );

    const discoveryButton = screen.getByRole('button', { name: /discovery/i });
    const directoryButton = screen.getByRole('button', { name: /directory/i });

    // Test keyboard navigation
    discoveryButton.focus();
    fireEvent.keyDown(discoveryButton, { key: 'ArrowRight' });
    expect(directoryButton).toHaveFocus();

    fireEvent.keyDown(directoryButton, { key: 'ArrowLeft' });
    expect(discoveryButton).toHaveFocus();

    fireEvent.keyDown(discoveryButton, { key: 'Enter' });
    expect(mockOnChange).toHaveBeenCalledWith('grid');
  });
});
