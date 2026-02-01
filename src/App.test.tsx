import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

// Mock AWS Amplify
vi.mock('aws-amplify/data', () => ({
  generateClient: () => ({
    models: {
      Todo: {
        observeQuery: () => ({
          subscribe: () => ({ unsubscribe: vi.fn() }),
        }),
        create: vi.fn(),
      },
    },
  }),
}));

describe('Dark Mode Toggle', () => {
  beforeEach(() => {
    document.body.className = '';
  });

  it('renders dark mode toggle button', () => {
    render(<App />);
    const toggleButton = screen.getByText(/Toggle Dark Mode/i);
    expect(toggleButton).toBeInTheDocument();
  });

  it('toggles dark mode class on body when button is clicked', () => {
    render(<App />);
    const toggleButton = screen.getByText(/Toggle Dark Mode/i);

    // Initially, dark mode should not be active
    expect(document.body.classList.contains('dark-mode')).toBe(false);

    // Click to enable dark mode
    fireEvent.click(toggleButton);
    expect(document.body.classList.contains('dark-mode')).toBe(true);

    // Click again to disable dark mode
    fireEvent.click(toggleButton);
    expect(document.body.classList.contains('dark-mode')).toBe(false);
  });

  it('displays correct icon based on dark mode state', () => {
    render(<App />);
    const toggleButton = screen.getByText(/Toggle Dark Mode/i);

    // Initially shows moon icon (light mode)
    expect(toggleButton.textContent).toContain('🌙');

    // After clicking, shows sun icon (dark mode)
    fireEvent.click(toggleButton);
    expect(toggleButton.textContent).toContain('☀️');
  });
});
