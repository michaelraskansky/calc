import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

const mockTodos = [
  { id: '1', content: 'Old todo', createdAt: '2024-01-01T10:00:00Z' },
  { id: '2', content: 'Newest todo', createdAt: '2024-01-03T10:00:00Z' },
  { id: '3', content: 'Middle todo', createdAt: '2024-01-02T10:00:00Z' },
];

// Mock the Amplify client
vi.mock('aws-amplify/data', () => ({
  generateClient: () => ({
    models: {
      Todo: {
        observeQuery: vi.fn(() => ({
          subscribe: (cb: any) => {
            // Trigger the callback immediately with mock data
            cb.next({ items: mockTodos });
            return { unsubscribe: vi.fn() };
          },
        })),
        create: vi.fn(),
      },
    },
  }),
}));

import App from './App';

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('sorts todos by createdAt with newest first', () => {
    render(<App />);

    // Get all list items
    const listItems = screen.getAllByRole('listitem');

    // Verify they're in the correct order (newest first)
    expect(listItems[0]).toHaveTextContent('Newest todo');
    expect(listItems[1]).toHaveTextContent('Middle todo');
    expect(listItems[2]).toHaveTextContent('Old todo');
  });
});
