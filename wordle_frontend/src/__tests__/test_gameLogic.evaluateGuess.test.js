import { describe, it, expect } from '@jest/globals';

/**
 * These tests specify the public behavior of evaluateGuess(word, target).
 * The implementation should live under src/game/logic.js (or similar) and export evaluateGuess.
 *
 * Contract:
 * - Input: guess (string), target (string). Both 5-letter lowercase alphabetic strings.
 * - Output: Array of 5 objects: { letter: string, status: 'correct'|'present'|'absent' }
 *   - 'correct': same letter in the same position
 *   - 'present': letter exists in target but in a different position, respecting duplicate accounting
 *   - 'absent': letter does not exist in target (or all occurrences already matched/allocated)
 *
 * Additional helpers to be implemented later may include:
 * - isWin(result): boolean -> true when all statuses are 'correct'
 * - isLose(attemptIndex, maxAttempts): boolean -> true when attemptIndex >= maxAttempts and not win
 *
 * Note: These tests intentionally fail until evaluateGuess is implemented.
 */

// PUBLIC_INTERFACE
function mockEvaluateGuess(guess, target) {
  // Temporary placeholder to make the file runnable if directly imported accidentally.
  // The real implementation must be placed in src/game/logic.js and exported.
  // This function is NOT used by tests; they import from the real module.
  return [];
}

describe('evaluateGuess(word, target) - core status evaluation', () => {
  // We import lazily inside each test to avoid hoisting a non-existing module before it is created.
  const loadEval = async () => {
    // Dynamically import to allow test-first flow before the file exists.
    // When the implementation is created, it should be at: src/game/logic.js
    // and export: export function evaluateGuess(guess, target) { ... }
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    const mod = await import('../game/logic.js');
    return mod.evaluateGuess;
  };

  it('marks letters as correct when in the same position', async () => {
    const evaluateGuess = await loadEval();
    const result = evaluateGuess('crane', 'candy');
    // c correct, r absent, a present (since a is in target but different spot), n present, e absent
    expect(result).toHaveLength(5);
    expect(result[0]).toEqual({ letter: 'c', status: 'correct' });
    expect(result[1]).toEqual({ letter: 'r', status: 'absent' });
    expect(result[2]).toEqual({ letter: 'a', status: 'present' });
    expect(result[3]).toEqual({ letter: 'n', status: 'present' });
    expect(result[4]).toEqual({ letter: 'e', status: 'absent' });
  });

  it('marks letters as present when they exist but in a different position', async () => {
    const evaluateGuess = await loadEval();
    const result = evaluateGuess('alert', 'petal');
    // target: p e t a l
    // guess:  a l e r t
    // a present, l present, e present, r absent, t present
    expect(result.map(r => r.status)).toEqual([
      'present', 'present', 'present', 'absent', 'present'
    ]);
    expect(result.map(r => r.letter).join('')).toBe('alert');
  });

  it('marks letters as absent when not in target', async () => {
    const evaluateGuess = await loadEval();
    const result = evaluateGuess('xxxxx', 'candy');
    expect(result.every(r => r.status === 'absent')).toBe(true);
  });

  it('handles duplicate letters in guess when target has a single occurrence (limit present allocation)', async () => {
    const evaluateGuess = await loadEval();
    // target has one 'a'
    const result = evaluateGuess('papal', 'candy');
    // guess: p a p a l
    // target: c a n d y
    // allocations:
    // - position 1 'a' is correct? target[1]=a? target is candy -> c a n d y: index 1 is 'a'
    //   But guess index 1 is 'a' indeed -> correct at index 1
    // For the other 'a' at index 3, no more a's remain -> absent
    // p absent, a correct, p absent, a absent, l absent
    expect(result.map(r => r.status)).toEqual([
      'absent', 'correct', 'absent', 'absent', 'absent'
    ]);
  });

  it('handles duplicate letters when target has multiples (properly limits present/correct totals)', async () => {
    const evaluateGuess = await loadEval();
    // target has two 'l': "bally"
    const result = evaluateGuess('llama', 'bally');
    // guess:  l  l  a  m  a
    // target: b  a  l  l  y
    // Step 1 - mark correct:
    //  - index 2: guess 'a' vs target 'l' -> not correct
    //  - index 0: l vs b -> not correct
    //  - index 1: l vs a -> not correct
    //  - index 3: m vs l -> not
    //  - index 4: a vs y -> not
    // So no 'correct' initially.
    // Counts in target: { b:1, a:1, l:2, y:1 }
    // Allocate presents in guess order:
    // index 0 'l' -> present (consume one l, left l:1)
    // index 1 'l' -> present (consume one l, left l:0)
    // index 2 'a' -> present (consume a, left a:0)
    // index 3 'm' -> absent
    // index 4 'a' -> absent (no a left)
    expect(result.map(r => r.status)).toEqual([
      'present', 'present', 'present', 'absent', 'absent'
    ]);
  });

  it('returns all correct when guess equals target (win condition basis)', async () => {
    const evaluateGuess = await loadEval();
    const result = evaluateGuess('cigar', 'cigar');
    expect(result.every(r => r.status === 'correct')).toBe(true);
  });

  it('mixed case input should be treated case-insensitively (normalize to lower)', async () => {
    const evaluateGuess = await loadEval();
    const result = evaluateGuess('CrAnE', 'CANdy');
    expect(result).toHaveLength(5);
    expect(result[0].status).toBe('correct'); // c vs c
    expect(result[1].status).toBe('absent');  // r vs a
    expect(result[2].status).toBe('present'); // a present
    expect(result[3].status).toBe('present'); // n present
    expect(result[4].status).toBe('absent');  // e absent
  });

  it('guards: non 5-letter guess or target should throw a descriptive error', async () => {
    const evaluateGuess = await loadEval();
    expect(() => evaluateGuess('toolong', 'abcde')).toThrow(/5-letter/i);
    expect(() => evaluateGuess('abcde', 'short')).not.toThrow(); // valid
    expect(() => evaluateGuess('abcd', 'abcde')).toThrow(/5-letter/i);
  });
});

describe('win/lose helpers (spec only, implementations to follow)', () => {
  const loadHelpers = async () => {
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    const mod = await import('../game/logic.js');
    return { isWin: mod.isWin, isLose: mod.isLose };
  };

  it('isWin returns true only when all statuses are correct', async () => {
    const { isWin } = await loadHelpers();
    const winRow = [
      { letter: 'c', status: 'correct' },
      { letter: 'i', status: 'correct' },
      { letter: 'g', status: 'correct' },
      { letter: 'a', status: 'correct' },
      { letter: 'r', status: 'correct' },
    ];
    const notWinRow = [
      { letter: 'c', status: 'correct' },
      { letter: 'i', status: 'present' },
      { letter: 'g', status: 'absent' },
      { letter: 'a', status: 'correct' },
      { letter: 'r', status: 'correct' },
    ];
    expect(isWin(winRow)).toBe(true);
    expect(isWin(notWinRow)).toBe(false);
  });

  it('isLose returns true on last attempt without a win', async () => {
    const { isLose } = await loadHelpers();
    // Suppose maxAttempts = 6, attemptIndex is zero-based.
    expect(isLose(5, 6, false)).toBe(true);  // last attempt used and not a win
    expect(isLose(5, 6, true)).toBe(false);  // win on last attempt is not a loss
    expect(isLose(3, 6, false)).toBe(false); // still attempts remaining
  });
});
