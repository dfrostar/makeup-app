import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { SearchBar } from '../SearchBar';
import { useVoiceSearch } from '../../../hooks/useVoiceSearch';

// Mock the useVoiceSearch hook
jest.mock('../../../hooks/useVoiceSearch');

describe('SearchBar', () => {
    const mockOnSearch = jest.fn();
    const defaultProps = {
        onSearch: mockOnSearch,
        suggestions: [],
        recentSearches: [],
        loading: false,
        placeholder: 'Search...',
        trendingSearches: ['Summer looks', 'Natural makeup'],
        productSuggestions: [],
        lookSuggestions: [],
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (useVoiceSearch as jest.Mock).mockReturnValue({
            isListening: false,
            transcript: '',
            isSupported: true,
            toggle: jest.fn(),
            start: jest.fn(),
            stop: jest.fn(),
        });
    });

    it('renders search input with voice button when supported', () => {
        render(<SearchBar {...defaultProps} />);
        
        expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
        expect(screen.getByTitle('Search by voice')).toBeInTheDocument();
    });

    it('shows listening state when voice search is active', () => {
        (useVoiceSearch as jest.Mock).mockReturnValue({
            isListening: true,
            transcript: 'red lipstick',
            isSupported: true,
            toggle: jest.fn(),
            start: jest.fn(),
            stop: jest.fn(),
        });

        render(<SearchBar {...defaultProps} />);
        
        expect(screen.getByPlaceholderText('Listening...')).toBeInTheDocument();
        expect(screen.getByText('Voice Commands')).toBeInTheDocument();
    });

    it('updates search query when voice transcript changes', () => {
        const mockToggle = jest.fn();
        (useVoiceSearch as jest.Mock).mockReturnValue({
            isListening: true,
            transcript: 'red lipstick',
            isSupported: true,
            toggle: mockToggle,
            start: jest.fn(),
            stop: jest.fn(),
        });

        render(<SearchBar {...defaultProps} />);
        
        expect(screen.getByDisplayValue('red lipstick')).toBeInTheDocument();
    });

    it('handles voice search toggle', () => {
        const mockToggle = jest.fn();
        (useVoiceSearch as jest.Mock).mockReturnValue({
            isListening: false,
            transcript: '',
            isSupported: true,
            toggle: mockToggle,
            start: jest.fn(),
            stop: jest.fn(),
        });

        render(<SearchBar {...defaultProps} />);
        
        fireEvent.click(screen.getByTitle('Search by voice'));
        expect(mockToggle).toHaveBeenCalled();
    });

    it('shows trending searches when focused and no query', () => {
        render(<SearchBar {...defaultProps} />);
        
        fireEvent.focus(screen.getByPlaceholderText('Search...'));
        
        expect(screen.getByText('Summer looks')).toBeInTheDocument();
        expect(screen.getByText('Natural makeup')).toBeInTheDocument();
    });

    it('clears search when clear button is clicked', () => {
        render(<SearchBar {...defaultProps} />);
        
        const input = screen.getByPlaceholderText('Search...');
        fireEvent.change(input, { target: { value: 'test' } });
        
        const clearButton = screen.getByRole('button');
        fireEvent.click(clearButton);
        
        expect(input).toHaveValue('');
    });

    it('handles visual search button click', () => {
        render(<SearchBar {...defaultProps} />);
        
        const visualSearchButton = screen.getByTitle('Search by image');
        fireEvent.click(visualSearchButton);
        
        // TODO: Add assertions when visual search is implemented
    });

    it('shows loading state', () => {
        render(<SearchBar {...defaultProps} loading={true} />);
        
        expect(screen.getByText('Searching...')).toBeInTheDocument();
    });

    it('handles keyboard navigation in suggestions', () => {
        render(
            <SearchBar
                {...defaultProps}
                suggestions={['Suggestion 1', 'Suggestion 2']}
            />
        );
        
        const input = screen.getByPlaceholderText('Search...');
        fireEvent.focus(input);
        fireEvent.change(input, { target: { value: 'test' } });
        
        // Test keyboard navigation
        fireEvent.keyDown(input, { key: 'ArrowDown' });
        fireEvent.keyDown(input, { key: 'Enter' });
        
        expect(mockOnSearch).toHaveBeenCalled();
    });

    // Test accessibility
    it('meets accessibility requirements', () => {
        const { container } = render(<SearchBar {...defaultProps} />);
        
        // Check for ARIA attributes
        expect(screen.getByRole('searchbox')).toBeInTheDocument();
        expect(screen.getByTitle('Search by voice')).toHaveAttribute('aria-label');
        expect(screen.getByTitle('Search by image')).toHaveAttribute('aria-label');
    });
});
