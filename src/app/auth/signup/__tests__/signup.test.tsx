/**
 * @module SignupTests
 * @fileoverview Tests for the signup page
 * @since 1.0.0
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import SignupPage from '../page';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

// Mock the useAuth hook
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

// Mock the useRouter hook
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

describe('SignupPage', () => {
  const mockSignUp = vi.fn();
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup mocks
    (useAuth as jest.Mock).mockReturnValue({
      signUp: mockSignUp,
    });
    
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it('renders the signup form', () => {
    render(<SignupPage />);
    
    expect(screen.getByText('Create an account')).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign up/i })).toBeInTheDocument();
  });

  it('validates matching passwords', async () => {
    render(<SignupPage />);
    
    // Fill out the form with non-matching passwords
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'test@example.com' },
    });
    
    fireEvent.change(screen.getByLabelText(/^Password$/i), {
      target: { value: 'password123' },
    });
    
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
      target: { value: 'differentpassword' },
    });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Sign up/i }));
    
    // Check for error message
    expect(await screen.findByText('Passwords do not match')).toBeInTheDocument();
    
    // Verify signUp wasn't called
    expect(mockSignUp).not.toHaveBeenCalled();
  });

  it('validates password length', async () => {
    render(<SignupPage />);
    
    // Fill out the form with a short password
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'test@example.com' },
    });
    
    fireEvent.change(screen.getByLabelText(/^Password$/i), {
      target: { value: 'short' },
    });
    
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
      target: { value: 'short' },
    });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Sign up/i }));
    
    // Check for error message
    expect(await screen.findByText('Password must be at least 8 characters')).toBeInTheDocument();
    
    // Verify signUp wasn't called
    expect(mockSignUp).not.toHaveBeenCalled();
  });

  it('validates email format', async () => {
    render(<SignupPage />);
    
    // Fill out the form with an invalid email
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'invalid-email' },
    });
    
    fireEvent.change(screen.getByLabelText(/^Password$/i), {
      target: { value: 'password123' },
    });
    
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
      target: { value: 'password123' },
    });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Sign up/i }));
    
    // Check for error message
    await waitFor(() => {
      expect(screen.getByText(/Please enter a valid email address/i)).toBeInTheDocument();
    });
    
    // Verify signUp wasn't called
    expect(mockSignUp).not.toHaveBeenCalled();
  });

  it('handles successful signup', async () => {
    render(<SignupPage />);
    
    // Fill out the form correctly
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'test@example.com' },
    });
    
    fireEvent.change(screen.getByLabelText(/^Password$/i), {
      target: { value: 'password123' },
    });
    
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
      target: { value: 'password123' },
    });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Sign up/i }));
    
    // Wait for the signUp function to be called
    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith('test@example.com', 'password123');
    });
    
    // Check for success message
    await waitFor(() => {
      expect(screen.getByText(/Account created successfully/i)).toBeInTheDocument();
    });
    
    // We're not going to check for the redirect since it uses setTimeout
  });

  it('handles signup errors', async () => {
    // Setup signUp to throw an error
    mockSignUp.mockRejectedValueOnce(new Error('Auth error'));
    
    render(<SignupPage />);
    
    // Fill out the form correctly
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'test@example.com' },
    });
    
    fireEvent.change(screen.getByLabelText(/^Password$/i), {
      target: { value: 'password123' },
    });
    
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
      target: { value: 'password123' },
    });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Sign up/i }));
    
    // Check for error message
    await waitFor(() => {
      expect(screen.getByText(/Failed to create account/i)).toBeInTheDocument();
    });
    
    // Verify we didn't redirect
    expect(mockPush).not.toHaveBeenCalled();
  });
});
