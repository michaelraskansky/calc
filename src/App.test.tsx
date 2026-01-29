import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

// Mock the AWS Amplify client
vi.mock('aws-amplify/data', () => ({
  generateClient: vi.fn(() => ({
    models: {
      Todo: {
        observeQuery: vi.fn(() => ({
          subscribe: vi.fn((callbacks) => {
            // Simulate initial empty state
            callbacks.next({ items: [] });
            return { unsubscribe: vi.fn() };
          }),
        })),
        create: vi.fn(),
        delete: vi.fn(),
      },
    },
  })),
}));

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the app with title and buttons', () => {
    render(<App />);

    expect(screen.getByText('My todos')).toBeTruthy();
    expect(screen.getByText('+ new')).toBeTruthy();
    expect(screen.getByText('clear')).toBeTruthy();
  });

  it('clear button exists', () => {
    render(<App />);

    const clearButton = screen.getByText('clear');
    expect(clearButton).toBeTruthy();
  });

  it('clear button can be clicked', () => {
    render(<App />);

    const clearButton = screen.getByText('clear');
    fireEvent.click(clearButton);

    // Test passes if no error is thrown
    expect(clearButton).toBeTruthy();
  });
});
