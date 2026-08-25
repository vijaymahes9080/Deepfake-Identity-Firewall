export function rateLimiter(tokensPerMinute = 120) {
  return (req, res, next) => next();
}