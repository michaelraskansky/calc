import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('Calculator', () => {
  it('multiplies two numbers correctly', () => {
    render(<App />);
    
    // Get input fields and button
    const input1 = screen.getByPlaceholderText('Enter first number');
    const input2 = screen.getByPlaceholderText('Enter second number');
    const multiplyButton = screen.getByText('Multiply');

    // Enter test values
    fireEvent.change(input1, { target: { value: '5' } });
    fireEvent.change(input2, { target: { value: '3' } });

    // Click multiply button
    fireEvent.click(multiplyButton);

    // Check result
    expect(screen.getByText('Result: 15')).toBeInTheDocument();
  });
});