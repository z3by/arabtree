import { describe, it, expect, beforeEach } from 'vitest';
import { rateLimit, _resetStorage } from '../rate-limit';

describe('rateLimit', () => {
  const config = {
    limit: 3,
    windowMs: 1000, // 1 second
  };

  beforeEach(() => {
    _resetStorage();
  });

  it('allows requests within the limit', async () => {
    const identifier = 'test-user';

    const result1 = await rateLimit(identifier, config);
    expect(result1.success).toBe(true);
    expect(result1.remaining).toBe(2);
    expect(result1.limit).toBe(3);

    const result2 = await rateLimit(identifier, config);
    expect(result2.success).toBe(true);
    expect(result2.remaining).toBe(1);

    const result3 = await rateLimit(identifier, config);
    expect(result3.success).toBe(true);
    expect(result3.remaining).toBe(0);
  });

  it('blocks requests exceeding the limit', async () => {
    const identifier = 'test-user';

    // Use up the limit
    await rateLimit(identifier, config);
    await rateLimit(identifier, config);
    await rateLimit(identifier, config);

    const result4 = await rateLimit(identifier, config);
    expect(result4.success).toBe(false);
    expect(result4.remaining).toBe(0);
    expect(result4.limit).toBe(3);
  });

  it('resets the limit after the window expires', async () => {
    const identifier = 'test-user';

    // Use up the limit
    await rateLimit(identifier, config);
    await rateLimit(identifier, config);
    await rateLimit(identifier, config);

    // Verify it's blocked
    const blocked = await rateLimit(identifier, config);
    expect(blocked.success).toBe(false);

    // Sleep to advance time
    await new Promise(resolve => setTimeout(resolve, config.windowMs + 50));

    const result = await rateLimit(identifier, config);
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(2);
  });

  it('isolates rate limits between different identifiers', async () => {
    const user1 = 'user-1';
    const user2 = 'user-2';

    // Use up limit for user1
    await rateLimit(user1, config);
    await rateLimit(user1, config);
    await rateLimit(user1, config);

    const result1 = await rateLimit(user1, config);
    expect(result1.success).toBe(false);

    // user2 should still be allowed
    const result2 = await rateLimit(user2, config);
    expect(result2.success).toBe(true);
    expect(result2.remaining).toBe(2);
  });

  it('prunes old entries when MAX_STORAGE_SIZE is reached', async () => {
    // Fill storage up to MAX_STORAGE_SIZE (1000)
    for (let i = 0; i < 1000; i++) {
      await rateLimit(`user-${i}`, config);
    }

    // This should trigger pruning of the oldest entry ('user-0')
    await rateLimit('new-user', config);

    // 'user-0' should be gone, so a new request for it should start a new window
    const result = await rateLimit('user-0', config);
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(2); // Should be a new record
  });

  it('returns correct reset time in Unix seconds', async () => {
    const identifier = 'test-user';
    const now = Date.now();

    const result = await rateLimit(identifier, config);
    const expectedReset = Math.floor((now + config.windowMs) / 1000);
    // Use a small range to account for execution time
    expect(result.reset).toBeGreaterThanOrEqual(expectedReset);
    expect(result.reset).toBeLessThanOrEqual(expectedReset + 1);
  });
});
