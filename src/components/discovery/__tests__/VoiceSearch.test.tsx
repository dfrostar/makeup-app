import { render, screen, fireEvent } from "@testing-library/react";
import { VoiceSearch } from "../VoiceSearch";

describe("VoiceSearch", () => {
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders voice search button", () => {
    render(<VoiceSearch onSearch={mockOnSearch} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("toggles listening state when clicked", () => {
    render(<VoiceSearch onSearch={mockOnSearch} />);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-pressed", "true");
  });
});