import { useEffect, useRef, useState, useCallback } from 'react';
import { VisualSearchService } from '../services/visualSearch';

interface VisualSearchState {
    isSearching: boolean;
    results: any[];
    error: Error | null;
    isSupported: boolean;
}

interface VisualSearchOptions {
    onResults?: (results: any[]) => void;
    onError?: (error: Error) => void;
    maxResults?: number;
    similarityThreshold?: number;
}

export function useVisualSearch(options: VisualSearchOptions = {}) {
    const visualService = useRef<VisualSearchService | null>(null);
    const [state, setState] = useState<VisualSearchState>({
        isSearching: false,
        results: [],
        error: null,
        isSupported: false,
    });

    useEffect(() => {
        visualService.current = new VisualSearchService({
            maxResults: options.maxResults,
            similarityThreshold: options.similarityThreshold,
        });

        setState(prev => ({
            ...prev,
            isSupported: visualService.current.isSupported(),
        }));

        return () => {
            visualService.current = null;
        };
    }, [options.maxResults, options.similarityThreshold]);

    useEffect(() => {
        if (!visualService.current) return;

        const service = visualService.current;

        service.on('searchStart', () => {
            setState(prev => ({ ...prev, isSearching: true, error: null }));
        });

        service.on('searchComplete', (results: any[]) => {
            setState(prev => ({ ...prev, isSearching: false, results }));
            options.onResults?.(results);
        });

        service.on('error', (error: Error) => {
            setState(prev => ({ ...prev, isSearching: false, error }));
            options.onError?.(error);
        });

        return () => {
            service.removeAllListeners();
        };
    }, [options.onResults, options.onError]);

    const searchByImage = useCallback(async (file: File) => {
        if (!visualService.current) return;
        await visualService.current.searchByImage(file);
    }, []);

    const searchByCamera = useCallback(async () => {
        if (!visualService.current) return;
        await visualService.current.searchByCamera();
    }, []);

    const isSupported = useCallback(() => {
        return visualService.current?.isSupported() ?? false;
    }, []);

    return {
        ...state,
        searchByImage,
        searchByCamera,
        isSupported,
    };
}
