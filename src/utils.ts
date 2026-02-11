/**
 * Divides two numbers with error handling for division by zero
 * @param a - The dividend
 * @param b - The divisor
 * @returns The result of a/b, or null if b is zero
 */
export function divide(a: number, b: number): number | null {
  if (b === 0) {
    console.warn('Division by zero attempted. Returning null.');
    return null;
  }
  return a / b;
}