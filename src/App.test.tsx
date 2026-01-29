import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('Calculator', () => {
  it('should calculate square root of 16', async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);

    const buttons = screen.getAllByText('1');
    const button1 = buttons.find(el => el.tagName === 'BUTTON')!;
    const buttons6 = screen.getAllByText('6');
    const button6 = buttons6.find(el => el.tagName === 'BUTTON')!;
    const sqrtButton = screen.getByText('√');

    await user.click(button1);
    await user.click(button6);
    await user.click(sqrtButton);

    const display = container.querySelector('div[style*="background-color: rgb(240, 240, 240)"]');
    expect(display?.textContent).toBe('4');
  });

  it('should calculate square root of 9', async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);

    const buttons9 = screen.getAllByText('9');
    const button9 = buttons9.find(el => el.tagName === 'BUTTON')!;
    const sqrtButton = screen.getByText('√');

    await user.click(button9);
    await user.click(sqrtButton);

    const display = container.querySelector('div[style*="background-color: rgb(240, 240, 240)"]');
    expect(display?.textContent).toBe('3');
  });

  it('should show error for square root of negative number', async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);

    const buttons0 = screen.getAllByText('0');
    const button0 = buttons0.find(el => el.tagName === 'BUTTON')!;
    const minusButton = screen.getByText('-');
    const buttons1 = screen.getAllByText('1');
    const button1 = buttons1.find(el => el.tagName === 'BUTTON')!;
    const equalsButton = screen.getByText('=');
    const sqrtButton = screen.getByText('√');

    await user.click(button0);
    await user.click(minusButton);
    await user.click(button1);
    await user.click(equalsButton);
    await user.click(sqrtButton);

    const display = container.querySelector('div[style*="background-color: rgb(240, 240, 240)"]');
    expect(display?.textContent).toBe('Error');
  });

  it('should calculate square root of 25', async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);

    const buttons2 = screen.getAllByText('2');
    const button2 = buttons2.find(el => el.tagName === 'BUTTON')!;
    const buttons5 = screen.getAllByText('5');
    const button5 = buttons5.find(el => el.tagName === 'BUTTON')!;
    const sqrtButton = screen.getByText('√');

    await user.click(button2);
    await user.click(button5);
    await user.click(sqrtButton);

    const display = container.querySelector('div[style*="background-color: rgb(240, 240, 240)"]');
    expect(display?.textContent).toBe('5');
  });
});
