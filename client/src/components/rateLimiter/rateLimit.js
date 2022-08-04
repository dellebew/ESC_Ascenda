const { RedisRateLimiter } = require("rolling-rate-limiter");

const limiter = new RedisRateLimiter({
  client: redisClient, // client instance from `redis` or `ioredis`
  namespace: "rate-limiter", // prefix for redis keys
  interval: 30000, // milliseconds
  maxInInterval: 5,
});

function rateLimiting (req, res, next) {
  limiter.limit(req.ipAddress).then((wasBlocked) => {
    if (wasBlocked) {
      return res.status(429).send("Too many requests");
    } else {
      return next();
    }
  });
};

module.exports(rateLimiting)