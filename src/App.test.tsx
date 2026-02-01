import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

// Create mock functions using vi.hoisted to ensure they're available during module initialization
const { mockUpdate, mockCreate, mockObserveQuery } = vi.hoisted(() => ({
  mockUpdate: vi.fn(),
  mockCreate: vi.fn(),
  mockObserveQuery: vi.fn(),
}));

// Mock the AWS Amplify client
vi.mock('aws-amplify/data', () => ({
  generateClient: vi.fn(() => ({
    models: {
      Todo: {
        observeQuery: mockObserveQuery,
        create: mockCreate,
        update: mockUpdate,
      },
    },
  })),
}));

import App from './App';

describe('App - Archive Feature', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockObserveQuery.mockReturnValue({
      subscribe: vi.fn((callbacks) => {
        callbacks.next({ items: [] });
        return { unsubscribe: vi.fn() };
      }),
    });
  });

  it('should render the app with todos heading', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /my todos/i })).toBeDefined();
  });

  it('should show archive button only for completed todos', () => {
    mockObserveQuery.mockReturnValue({
      subscribe: vi.fn((callbacks) => {
        callbacks.next({
          items: [
            { id: '1', content: 'Todo 1', isDone: false, isArchived: false },
            { id: '2', content: 'Todo 2', isDone: true, isArchived: false },
          ],
        });
        return { unsubscribe: vi.fn() };
      }),
    });

    render(<App />);

    const archiveButtons = screen.queryAllByRole('button', { name: /^archive$/i });
    expect(archiveButtons.length).toBe(1);
  });

  it('should archive a completed todo when archive button is clicked', () => {
    mockObserveQuery.mockReturnValue({
      subscribe: vi.fn((callbacks) => {
        callbacks.next({
          items: [
            { id: '1', content: 'Completed Todo', isDone: true, isArchived: false },
          ],
        });
        return { unsubscribe: vi.fn() };
      }),
    });

    render(<App />);

    const archiveButton = screen.getByRole('button', { name: /^archive$/i });
    fireEvent.click(archiveButton);

    expect(mockUpdate).toHaveBeenCalledWith({ id: '1', isArchived: true });
  });

  it('should not show archived todos in active list', () => {
    mockObserveQuery.mockReturnValue({
      subscribe: vi.fn((callbacks) => {
        callbacks.next({
          items: [
            { id: '1', content: 'Active Todo', isDone: false, isArchived: false },
            { id: '2', content: 'Archived Todo', isDone: true, isArchived: true },
          ],
        });
        return { unsubscribe: vi.fn() };
      }),
    });

    render(<App />);

    expect(screen.getByText('Active Todo')).toBeDefined();
    expect(screen.queryByText('Archived Todo')).toBeNull();
  });

  it('should show archived todos when show archived button is clicked', () => {
    mockObserveQuery.mockReturnValue({
      subscribe: vi.fn((callbacks) => {
        callbacks.next({
          items: [
            { id: '1', content: 'Active Todo', isDone: false, isArchived: false },
            { id: '2', content: 'Archived Todo', isDone: true, isArchived: true },
          ],
        });
        return { unsubscribe: vi.fn() };
      }),
    });

    render(<App />);

    const showArchivedButton = screen.getByRole('button', { name: /show archived/i });
    fireEvent.click(showArchivedButton);

    expect(screen.getByText('Archived Todo')).toBeDefined();
  });

  it('should display archived count correctly', () => {
    mockObserveQuery.mockReturnValue({
      subscribe: vi.fn((callbacks) => {
        callbacks.next({
          items: [
            { id: '1', content: 'Todo 1', isDone: false, isArchived: false },
            { id: '2', content: 'Todo 2', isDone: true, isArchived: true },
            { id: '3', content: 'Todo 3', isDone: true, isArchived: true },
          ],
        });
        return { unsubscribe: vi.fn() };
      }),
    });

    render(<App />);

    expect(screen.getByText(/show archived \(2\)/i)).toBeDefined();
  });
});
