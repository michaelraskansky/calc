import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock the AWS Amplify client - use a factory function to avoid hoisting issues
const mockCreate = vi.fn();
const mockSubscribe = vi.fn();

vi.mock('aws-amplify/data', () => ({
  generateClient: () => ({
    models: {
      Todo: {
        observeQuery: () => ({
          subscribe: () => mockSubscribe(),
        }),
        create: (...args: any[]) => mockCreate(...args),
      },
    },
  }),
}));

import App from './App';

describe('App', () => {
  beforeEach(() => {
    mockCreate.mockClear();
    mockSubscribe.mockClear();
  });

  it('should not create a todo when user cancels the prompt', () => {
    // Mock window.prompt to return null (user cancels)
    vi.spyOn(window, 'prompt').mockReturnValue(null);

    render(<App />);

    const button = screen.getByText('+ new');
    fireEvent.click(button);

    // Verify create was NOT called
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('should not create a todo when user enters empty string', () => {
    // Mock window.prompt to return empty string
    vi.spyOn(window, 'prompt').mockReturnValue('');

    render(<App />);

    const button = screen.getByText('+ new');
    fireEvent.click(button);

    // Verify create was NOT called
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('should create a todo when user enters valid content', () => {
    // Mock window.prompt to return valid content
    vi.spyOn(window, 'prompt').mockReturnValue('Test todo');

    render(<App />);

    const button = screen.getByText('+ new');
    fireEvent.click(button);

    // Verify create WAS called with the content
    expect(mockCreate).toHaveBeenCalledWith({ content: 'Test todo' });
  });
});
