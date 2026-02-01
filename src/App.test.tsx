import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock AWS Amplify client
const mockSubscribe = vi.fn();
vi.mock('aws-amplify/data', () => ({
  generateClient: vi.fn(() => ({
    models: {
      Todo: {
        observeQuery: vi.fn(() => ({
          subscribe: mockSubscribe,
        })),
        create: vi.fn(),
        update: vi.fn(),
      },
    },
  })),
}));

describe('App - Status Badge Feature', () => {
  it('renders the todo app with status badge showing 0/0 completed when no todos', () => {
    mockSubscribe.mockImplementation((callbacks) => {
      callbacks.next({ items: [] });
      return { unsubscribe: vi.fn() };
    });

    render(<App />);
    expect(screen.getByText('My todos')).toBeInTheDocument();
    expect(screen.getByText(/0\/0 completed/)).toBeInTheDocument();
  });

  it('displays the status badge with 2/3 completed', () => {
    mockSubscribe.mockImplementation((callbacks) => {
      callbacks.next({
        items: [
          { id: '1', content: 'Task 1', isDone: true },
          { id: '2', content: 'Task 2', isDone: false },
          { id: '3', content: 'Task 3', isDone: true },
        ],
      });
      return { unsubscribe: vi.fn() };
    });

    render(<App />);
    expect(screen.getByText(/2\/3 completed/)).toBeInTheDocument();
  });

  it('shows 2/2 completed when all todos are done', () => {
    mockSubscribe.mockImplementation((callbacks) => {
      callbacks.next({
        items: [
          { id: '1', content: 'Task 1', isDone: true },
          { id: '2', content: 'Task 2', isDone: true },
        ],
      });
      return { unsubscribe: vi.fn() };
    });

    render(<App />);
    expect(screen.getByText(/2\/2 completed/)).toBeInTheDocument();
  });

  it('shows 0/3 completed when no todos are done', () => {
    mockSubscribe.mockImplementation((callbacks) => {
      callbacks.next({
        items: [
          { id: '1', content: 'Task 1', isDone: false },
          { id: '2', content: 'Task 2', isDone: false },
          { id: '3', content: 'Task 3', isDone: false },
        ],
      });
      return { unsubscribe: vi.fn() };
    });

    render(<App />);
    expect(screen.getByText(/0\/3 completed/)).toBeInTheDocument();
  });
});
