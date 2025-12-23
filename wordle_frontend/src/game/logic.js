/**
 * PUBLIC_INTERFACE
 * evaluateGuess(guess, target)
 * This file is intentionally left unimplemented per TDD. The tests define the contract.
 * Implementations should:
 *  - Validate inputs (5-letter alphabetic strings)
 *  - Normalize inputs to lowercase
 *  - Return an array of 5 objects: { letter, status: 'correct'|'present'|'absent' }
 *  - Handle duplicate letters properly (Wordle rules)
 */

// PUBLIC_INTERFACE
export function evaluateGuess(/* guess, target */) {
  throw new Error('Not implemented yet: evaluateGuess');
}

// PUBLIC_INTERFACE
export function isWin(/* resultRow */) {
  throw new Error('Not implemented yet: isWin');
}

// PUBLIC_INTERFACE
export function isLose(/* attemptIndex, maxAttempts, didWin */) {
  throw new Error('Not implemented yet: isLose');
}
