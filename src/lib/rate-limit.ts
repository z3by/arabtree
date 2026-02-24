
export interface RateLimitConfig {
  limit: number;
  windowMs: number;
}

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

// In-memory storage with a limit on the number of tracked identifiers
// to prevent memory exhaustion (DoS vulnerability).
const storage = new Map<string, RateLimitRecord>();
const MAX_STORAGE_SIZE = 1000;

/**
 * Simple in-memory rate limiter.
 *
 * IMPORTANT: This is an in-memory implementation and will not share state across
 * multiple serverless function instances. For a production-grade solution,
 * consider using Redis (e.g., Upstash) as per the project architecture.
 */
export async function rateLimit(identifier: string, config: RateLimitConfig) {
  const now = Date.now();

  // 1. Cleanup expired entries periodically or when accessed
  const record = storage.get(identifier);

  if (!record || now > record.resetTime) {
    // 2. Prevent memory leak: if storage is too large, prune it
    if (storage.size >= MAX_STORAGE_SIZE) {
      // Basic pruning: remove the oldest entry (Map maintains insertion order)
      const firstKey = storage.keys().next().value;
      if (firstKey) storage.delete(firstKey);
    }

    // New window or expired window
    const newRecord = {
      count: 1,
      resetTime: now + config.windowMs,
    };
    storage.set(identifier, newRecord);
    return {
      success: true,
      limit: config.limit,
      remaining: config.limit - 1,
      reset: Math.floor(newRecord.resetTime / 1000), // Standard Unix seconds
    };
  }

  if (record.count >= config.limit) {
    return {
      success: false,
      limit: config.limit,
      remaining: 0,
      reset: Math.floor(record.resetTime / 1000), // Standard Unix seconds
    };
  }

  record.count += 1;
  return {
    success: true,
    limit: config.limit,
    remaining: config.limit - record.count,
    reset: Math.floor(record.resetTime / 1000), // Standard Unix seconds
  };
}
