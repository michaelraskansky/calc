import { divide } from './utils';

// Simple test runner
function runTests() {
  let passed = 0;
  let failed = 0;

  function test(description: string, testFn: () => void) {
    try {
      testFn();
      console.log(`✅ ${description}`);
      passed++;
    } catch (error) {
      console.log(`❌ ${description}: ${error}`);
      failed++;
    }
  }

  function assertEqual(actual: any, expected: any) {
    if (actual !== expected) {
      throw new Error(`Expected ${expected}, but got ${actual}`);
    }
  }

  // Test cases
  test('divide should return correct result for normal division', () => {
    assertEqual(divide(10, 2), 5);
    assertEqual(divide(15, 3), 5);
    assertEqual(divide(7, 2), 3.5);
  });

  test('divide should return null for division by zero', () => {
    assertEqual(divide(10, 0), null);
    assertEqual(divide(-5, 0), null);
    assertEqual(divide(0, 0), null);
  });

  test('divide should handle negative numbers correctly', () => {
    assertEqual(divide(-10, 2), -5);
    assertEqual(divide(10, -2), -5);
    assertEqual(divide(-10, -2), 5);
  });

  test('divide should handle decimal numbers correctly', () => {
    assertEqual(divide(1.5, 0.5), 3);
    assertEqual(divide(2.5, 2), 1.25);
  });

  console.log(`\nTest Results: ${passed} passed, ${failed} failed`);
  return failed === 0;
}

// Run tests if this file is executed directly
if (typeof window === 'undefined') {
  runTests();
}

export { runTests };