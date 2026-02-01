import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

// Mock the AWS Amplify client
vi.mock('aws-amplify/data', () => ({
  generateClient: vi.fn(() => ({
    models: {
      Todo: {
        observeQuery: vi.fn(() => ({
          subscribe: vi.fn((callbacks) => {
            // Simulate initial data load with different priorities
            callbacks.next({
              items: [
                { id: '1', content: 'High priority task', priority: 'High' },
                { id: '2', content: 'Low priority task', priority: 'Low' },
                { id: '3', content: 'Medium priority task', priority: 'Medium' },
              ]
            });
            return { unsubscribe: vi.fn() };
          })
        })),
        create: vi.fn()
      }
    }
  }))
}));

describe('Todo Priority Filtering', () => {
  it('should display all todos when filter is set to All', async () => {
    render(<App />);

    const filterSelect = screen.getByLabelText(/filter by priority/i);
    expect(filterSelect).toHaveValue('All');

    expect(screen.getByText(/\[High\] High priority task/)).toBeInTheDocument();
    expect(screen.getByText(/\[Low\] Low priority task/)).toBeInTheDocument();
    expect(screen.getByText(/\[Medium\] Medium priority task/)).toBeInTheDocument();
  });

  it('should filter todos by High priority', async () => {
    render(<App />);

    const filterSelect = screen.getByLabelText(/filter by priority/i);
    fireEvent.change(filterSelect, { target: { value: 'High' } });

    expect(screen.getByText(/\[High\] High priority task/)).toBeInTheDocument();
    expect(screen.queryByText(/\[Low\] Low priority task/)).not.toBeInTheDocument();
    expect(screen.queryByText(/\[Medium\] Medium priority task/)).not.toBeInTheDocument();
  });

  it('should filter todos by Medium priority', async () => {
    render(<App />);

    const filterSelect = screen.getByLabelText(/filter by priority/i);
    fireEvent.change(filterSelect, { target: { value: 'Medium' } });

    expect(screen.queryByText(/\[High\] High priority task/)).not.toBeInTheDocument();
    expect(screen.queryByText(/\[Low\] Low priority task/)).not.toBeInTheDocument();
    expect(screen.getByText(/\[Medium\] Medium priority task/)).toBeInTheDocument();
  });

  it('should filter todos by Low priority', async () => {
    render(<App />);

    const filterSelect = screen.getByLabelText(/filter by priority/i);
    fireEvent.change(filterSelect, { target: { value: 'Low' } });

    expect(screen.queryByText(/\[High\] High priority task/)).not.toBeInTheDocument();
    expect(screen.getByText(/\[Low\] Low priority task/)).toBeInTheDocument();
    expect(screen.queryByText(/\[Medium\] Medium priority task/)).not.toBeInTheDocument();
  });

  it('should display priority in todo list items', async () => {
    render(<App />);

    const todos = screen.getAllByRole('listitem');
    expect(todos[0]).toHaveTextContent('[High] High priority task');
    expect(todos[1]).toHaveTextContent('[Low] Low priority task');
    expect(todos[2]).toHaveTextContent('[Medium] Medium priority task');
  });
});
