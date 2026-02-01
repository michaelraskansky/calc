# Testing Guide for Todo Sorting Feature

## Manual Testing Steps

### Test Sorting Functionality

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Create several todos with different content:
   - "Zebra"
   - "Apple"
   - "Monkey"
   - "Banana"

3. Click the "Sort" button and verify:
   - First click: Shows "Sort: A-Z" - todos should be sorted alphabetically (Apple, Banana, Monkey, Zebra)
   - Second click: Shows "Sort: Z-A" - todos should be sorted reverse alphabetically (Zebra, Monkey, Banana, Apple)
   - Third click: Shows "Sort: None" - todos should return to original order

### Expected Behavior

- The sort button toggles between three states: None → A-Z → Z-A → None
- Sorting is case-insensitive using `localeCompare()`
- Empty or null content is handled gracefully
- Sorting is purely client-side and doesn't affect the database order

## Code Verification

The implementation includes:
- State management for sort order (`sortOrder` state with "none" | "asc" | "desc")
- Toggle function that cycles through sort states
- Computed `sortedTodos` array that applies sorting based on current state
- UI button showing current sort state

## Linting

Run linting to verify code quality:
```bash
npm run lint
```

Expected result: No errors or warnings.
