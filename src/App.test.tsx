import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Create mock functions in the factory
vi.mock('aws-amplify/data', () => {
  const mockDelete = vi.fn();
  const mockCreate = vi.fn();
  const mockObserveQuery = vi.fn();

  return {
    generateClient: vi.fn(() => ({
      models: {
        Todo: {
          delete: mockDelete,
          create: mockCreate,
          observeQuery: mockObserveQuery,
        },
      },
    })),
  };
});

import App from './App';
import { generateClient } from 'aws-amplify/data';

describe('App - Todo Delete Functionality', () => {
  let mockDelete: any;
  let mockObserveQuery: any;

  beforeEach(() => {
    vi.clearAllMocks();

    const client = (generateClient as any)();
    mockDelete = client.models.Todo.delete;
    mockObserveQuery = client.models.Todo.observeQuery;

    // Setup the observeQuery mock to return sample todos
    mockObserveQuery.mockReturnValue({
      subscribe: (callbacks: any) => {
        callbacks.next({
          items: [
            { id: '1', content: 'Test todo 1' },
            { id: '2', content: 'Test todo 2' },
          ],
        });
        return { unsubscribe: vi.fn() };
      },
    });
  });

  it('renders delete buttons for each todo', () => {
    render(<App />);

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    expect(deleteButtons).toHaveLength(2);
  });

  it('calls delete function when delete button is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    await user.click(deleteButtons[0]);

    expect(mockDelete).toHaveBeenCalledTimes(1);
    expect(mockDelete).toHaveBeenCalledWith({ id: '1' });
  });

  it('calls delete with correct id for the second todo', async () => {
    const user = userEvent.setup();
    render(<App />);

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    await user.click(deleteButtons[1]);

    expect(mockDelete).toHaveBeenCalledTimes(1);
    expect(mockDelete).toHaveBeenCalledWith({ id: '2' });
  });

  it('displays todo content alongside delete button', () => {
    render(<App />);

    expect(screen.getByText('Test todo 1')).toBeInTheDocument();
    expect(screen.getByText('Test todo 2')).toBeInTheDocument();
  });
});
