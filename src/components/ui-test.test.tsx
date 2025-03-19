/**
 * @module UITest
 * @fileoverview Tests for ShadcnUI component integration
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { UITest } from './ui-test';

describe('UITest Component', () => {
  it('renders the ShadcnUI components correctly', () => {
    render(<UITest />);
    
    // Check if the card title is rendered
    expect(screen.getByText('ShadcnUI Test')).toBeInTheDocument();
    
    // Check if the card description is rendered
    expect(screen.getByText('Testing ShadcnUI components')).toBeInTheDocument();
    
    // Check if the input label is rendered
    expect(screen.getByText('Name')).toBeInTheDocument();
    
    // Check if the input field is rendered
    expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument();
    
    // Check if the buttons are rendered
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Submit')).toBeInTheDocument();
  });
});
