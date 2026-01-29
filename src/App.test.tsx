import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

// Mock the AWS Amplify client
vi.mock('aws-amplify/data', () => ({
  generateClient: () => ({
    models: {
      Todo: {
        observeQuery: () => ({
          subscribe: () => ({ unsubscribe: () => {} }),
        }),
        create: vi.fn(),
      },
    },
  }),
}));

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('prevents duplicate todos on double-click', () => {
    const promptSpy = vi.spyOn(window, 'prompt');
    promptSpy.mockReturnValue('Test Todo');

    render(<App />);

    const button = screen.getByRole('button', { name: /\+ new/i });

    // Simulate double-click by clicking twice rapidly
    fireEvent.click(button);
    fireEvent.click(button);

    // window.prompt should only be called once
    expect(promptSpy).toHaveBeenCalledTimes(1);

    promptSpy.mockRestore();
  });

  it('enables button after prompt closes', async () => {
    const user = userEvent.setup();
    const promptSpy = vi.spyOn(window, 'prompt');
    promptSpy.mockReturnValue('Test Todo');

    render(<App />);

    const button = screen.getByRole('button', { name: /\+ new/i });
    expect(button).not.toBeDisabled();

    await user.click(button);

    // After prompt closes, button should be enabled again
    expect(button).not.toBeDisabled();

    promptSpy.mockRestore();
  });
});
