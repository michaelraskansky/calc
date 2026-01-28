import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

// Mock the Amplify client with factory function
vi.mock('aws-amplify/data', () => {
  const mockCreate = vi.fn();
  return {
    generateClient: () => ({
      models: {
        Todo: {
          observeQuery: () => ({
            subscribe: () => ({ unsubscribe: vi.fn() }),
          }),
          create: mockCreate,
        },
      },
    }),
    __mockCreate: mockCreate,
  };
});

// Import the mock after setup
import { __mockCreate } from 'aws-amplify/data';

describe('App', () => {
  beforeEach(() => {
    __mockCreate.mockClear();
  });

  it('should not create a todo when prompt returns null (user cancels)', () => {
    vi.spyOn(window, 'prompt').mockReturnValue(null);

    render(<App />);
    const button = screen.getByText('+ new');
    fireEvent.click(button);

    expect(__mockCreate).not.toHaveBeenCalled();
  });

  it('should not create a todo when prompt returns empty string', () => {
    vi.spyOn(window, 'prompt').mockReturnValue('');

    render(<App />);
    const button = screen.getByText('+ new');
    fireEvent.click(button);

    expect(__mockCreate).not.toHaveBeenCalled();
  });

  it('should not create a todo when prompt returns whitespace only', () => {
    vi.spyOn(window, 'prompt').mockReturnValue('   ');

    render(<App />);
    const button = screen.getByText('+ new');
    fireEvent.click(button);

    expect(__mockCreate).not.toHaveBeenCalled();
  });

  it('should create a todo when prompt returns valid content', () => {
    vi.spyOn(window, 'prompt').mockReturnValue('Buy groceries');

    render(<App />);
    const button = screen.getByText('+ new');
    fireEvent.click(button);

    expect(__mockCreate).toHaveBeenCalledWith({ content: 'Buy groceries' });
  });
});
