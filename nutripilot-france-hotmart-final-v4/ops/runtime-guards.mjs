// Share concurrent work without caching its result or retaining failures.
export function singleFlight(work) {
  let pending;
  return (...args) => {
    if (!pending) pending = Promise.resolve().then(() => work(...args)).finally(() => { pending = undefined; });
    return pending;
  };
}

// Single-process limiter. A full table rejects new identities rather than growing
// indefinitely or evicting live limits. Expired entries are reclaimed at most once
// a second under pressure; normal cleanup runs every five minutes.
export function createRateLimiter({ maxBuckets = 10000, now = Date.now } = {}) {
  if (!Number.isSafeInteger(maxBuckets) || maxBuckets < 1) throw new Error('Invalid rate limiter capacity');
  const buckets = new Map();
  let lastSweep = -Infinity;
  return (key, limit, windowMs) => {
    const time = now();
    if (!Number.isFinite(time) || !Number.isSafeInteger(limit) || limit < 1 || !Number.isFinite(windowMs) || windowMs <= 0) return false;
    if (time - lastSweep >= 300000 || (buckets.size >= maxBuckets && time - lastSweep >= 1000)) {
      for (const [id, bucket] of buckets) if (time >= bucket.resetAt) buckets.delete(id);
      lastSweep = time;
    }
    const previous = buckets.get(key);
    if (previous && time < previous.resetAt) {
      if (previous.count >= limit) return false;
      previous.count++;
      return true;
    }
    if (!previous && buckets.size >= maxBuckets) return false;
    buckets.set(key, { count: 1, resetAt: time + windowMs });
    return true;
  };
}
