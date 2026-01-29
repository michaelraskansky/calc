import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('Calculator App', () => {
  const getDisplay = () => screen.getByText(/\d+/, { selector: '.display' });
  const getButton = (text: string) => screen.getByRole('button', { name: text });

  it('renders with initial display of 0', () => {
    render(<App />);
    const display = getDisplay();
    expect(display).toHaveTextContent('0');
  });

  it('displays numbers when clicked', () => {
    render(<App />);
    fireEvent.click(getButton('5'));
    const display = getDisplay();
    expect(display).toHaveTextContent('5');
  });

  it('clears display to 0 when C button is clicked', () => {
    render(<App />);

    // Enter some numbers
    fireEvent.click(getButton('1'));
    fireEvent.click(getButton('2'));
    fireEvent.click(getButton('3'));
    let display = getDisplay();
    expect(display).toHaveTextContent('123');

    // Click the clear button
    fireEvent.click(getButton('C'));

    // Display should be reset to 0
    display = getDisplay();
    expect(display).toHaveTextContent('0');
  });

  it('clears display after performing a calculation', () => {
    render(<App />);

    // Perform a calculation: 5 + 3 = 8
    fireEvent.click(getButton('5'));
    fireEvent.click(getButton('+'));
    fireEvent.click(getButton('3'));
    fireEvent.click(getButton('='));
    let display = getDisplay();
    expect(display).toHaveTextContent('8');

    // Click clear
    fireEvent.click(getButton('C'));

    // Display should be reset to 0
    display = getDisplay();
    expect(display).toHaveTextContent('0');
  });

  it('performs basic addition', () => {
    render(<App />);
    fireEvent.click(getButton('2'));
    fireEvent.click(getButton('+'));
    fireEvent.click(getButton('3'));
    fireEvent.click(getButton('='));
    const display = getDisplay();
    expect(display).toHaveTextContent('5');
  });

  it('performs basic subtraction', () => {
    render(<App />);
    fireEvent.click(getButton('9'));
    fireEvent.click(getButton('-'));
    fireEvent.click(getButton('4'));
    fireEvent.click(getButton('='));
    const display = getDisplay();
    expect(display).toHaveTextContent('5');
  });

  it('calculates percentage of current value', () => {
    render(<App />);

    // Enter 50 and click %
    fireEvent.click(getButton('5'));
    fireEvent.click(getButton('0'));
    fireEvent.click(getButton('%'));

    const display = getDisplay();
    expect(display).toHaveTextContent('0.5');
  });

  it('calculates percentage of 100', () => {
    render(<App />);

    // Enter 100 and click %
    fireEvent.click(getButton('1'));
    fireEvent.click(getButton('0'));
    fireEvent.click(getButton('0'));
    fireEvent.click(getButton('%'));

    const display = getDisplay();
    expect(display).toHaveTextContent('1');
  });

  it('calculates percentage of 25', () => {
    render(<App />);

    // Enter 25 and click %
    fireEvent.click(getButton('2'));
    fireEvent.click(getButton('5'));
    fireEvent.click(getButton('%'));

    const display = getDisplay();
    expect(display).toHaveTextContent('0.25');
  });
});
