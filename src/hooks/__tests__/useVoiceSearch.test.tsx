import { renderHook, act } from "@testing-library/react";
import { useVoiceSearch } from "../useVoiceSearch";

describe("useVoiceSearch", () => {
    const mockOnSearch = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should initialize with default values", () => {
        const { result } = renderHook(() => useVoiceSearch(mockOnSearch));
        
        expect(result.current.isListening).toBe(false);
        expect(result.current.error).toBeNull();
        expect(result.current.isSupported).toBe(true);
    });

    it("should start listening when startListening is called", () => {
        const { result } = renderHook(() => useVoiceSearch(mockOnSearch));

        act(() => {
            result.current.startListening();
        });

        expect(result.current.isListening).toBe(true);
    });

    it("should stop listening when stopListening is called", () => {
        const { result } = renderHook(() => useVoiceSearch(mockOnSearch));

        act(() => {
            result.current.startListening();
        });
        expect(result.current.isListening).toBe(true);

        act(() => {
            result.current.stopListening();
        });
        expect(result.current.isListening).toBe(false);
    });

    it("should clean up listeners on unmount", () => {
        const { unmount } = renderHook(() => useVoiceSearch(mockOnSearch));
        unmount();
        // If no errors occur during unmount, the test passes
    });
});