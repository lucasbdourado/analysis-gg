import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SearchForm } from './SearchForm';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

describe('SearchForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all form elements in their default states', () => {
    render(<SearchForm />);

    const riotIdInput = screen.getByPlaceholderText('Riot ID (e.g., Hide on bush#KR1)');
    expect(riotIdInput).toBeInTheDocument();
    expect(riotIdInput).toHaveValue('');

    const regionSelect = screen.getByRole('combobox');
    expect(regionSelect).toBeInTheDocument();
    expect(regionSelect).toHaveValue('BR1');

    const submitButton = screen.getByRole('button', { name: /analyze/i });
    expect(submitButton).toBeInTheDocument();

    // No error text should be visible initially
    expect(screen.queryByText(/riot id is required/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/format must be name#tag/i)).not.toBeInTheDocument();
  });

  it('blocks navigation and displays "Riot ID is required" on empty submit', () => {
    render(<SearchForm />);

    const submitButton = screen.getByRole('button', { name: /analyze/i });
    fireEvent.click(submitButton);

    expect(mockNavigate).not.toHaveBeenCalled();
    
    const errorText = screen.getByText('Riot ID is required');
    expect(errorText).toBeInTheDocument();
  });

  it('blocks navigation and displays "Format must be Name#Tag" on malformed Riot ID', () => {
    render(<SearchForm />);

    const riotIdInput = screen.getByPlaceholderText('Riot ID (e.g., Hide on bush#KR1)');
    const submitButton = screen.getByRole('button', { name: /analyze/i });

    // Test a malformed ID (no # tag)
    fireEvent.change(riotIdInput, { target: { value: 'HideOnBush' } });
    fireEvent.click(submitButton);

    expect(mockNavigate).not.toHaveBeenCalled();
    expect(screen.getByText('Format must be Name#Tag')).toBeInTheDocument();
  });

  it('validates format on blur, showing error for invalid format and clearing on empty input', () => {
    render(<SearchForm />);

    const riotIdInput = screen.getByPlaceholderText('Riot ID (e.g., Hide on bush#KR1)');

    // Trigger blur with invalid value
    fireEvent.change(riotIdInput, { target: { value: 'InvalidRiotID' } });
    fireEvent.blur(riotIdInput);

    expect(screen.getByText('Format must be Name#Tag')).toBeInTheDocument();

    // Trigger blur with empty value, error should be cleared
    fireEvent.change(riotIdInput, { target: { value: '' } });
    fireEvent.blur(riotIdInput);

    expect(screen.queryByText('Format must be Name#Tag')).not.toBeInTheDocument();
    expect(screen.queryByText('Riot ID is required')).not.toBeInTheDocument();
  });

  it('navigates with encoded query parameters on valid submission', () => {
    render(<SearchForm />);

    const riotIdInput = screen.getByPlaceholderText('Riot ID (e.g., Hide on bush#KR1)');
    const regionSelect = screen.getByRole('combobox');
    const submitButton = screen.getByRole('button', { name: /analyze/i });

    // Input valid Riot ID and select region
    fireEvent.change(riotIdInput, { target: { value: 'Hide on bush#KR1' } });
    fireEvent.change(regionSelect, { target: { value: 'KR' } });

    // Submit
    fireEvent.click(submitButton);

    // Verify navigating to correct URL
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard?name=Hide%20on%20bush&tag=KR1&region=kr');
    expect(screen.queryByText('Riot ID is required')).not.toBeInTheDocument();
    expect(screen.queryByText('Format must be Name#Tag')).not.toBeInTheDocument();
  });
});
