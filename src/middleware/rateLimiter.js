module.exports = function rateLimiter({ windowMs = 60_000, max = 5 } = {}) {
  const hits = new Map();

  const CLEAN_INTERVAL = Math.max(60_000, windowMs);
  const timer = setInterval(() => {
    const now = Date.now();
    for (const [ip, entry] of hits) {
      if (entry.expiresAt <= now) hits.delete(ip);
    }
  }, CLEAN_INTERVAL);
  timer.unref?.();

  return (req, res, next) => {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    let entry = hits.get(ip);

    if (!entry || entry.expiresAt <= now) {
      entry = { count: 1, expiresAt: now + windowMs };
      hits.set(ip, entry);
    } else {
      entry.count++;
    }

    res.setHeader('X-RateLimit-Limit', String(max));
    res.setHeader('X-RateLimit-Remaining', String(Math.max(0, max - entry.count)));
    res.setHeader('X-RateLimit-Reset', String(Math.ceil((entry.expiresAt - now) / 1000)));

    if (entry.count > max) {
      const retryAfter = Math.ceil((entry.expiresAt - now) / 1000);
      res.status(429).json({ error: `Rate limit exceeded. Try again in ${retryAfter} seconds.` });
      return;
    }

    next();
  };
};
