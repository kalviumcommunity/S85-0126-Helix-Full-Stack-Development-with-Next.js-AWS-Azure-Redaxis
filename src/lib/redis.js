import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
  // Prevent ioredis from throwing "Reached the max retries per request limit"
  // when Redis is temporarily unavailable.
  maxRetriesPerRequest: null,
  // Backoff reconnect attempts (ms)
  retryStrategy(times) {
    const delay = Math.min(times * 200, 2000);
    return delay;
  },
  // Avoid noisy ready checks in serverless/dev environments
  enableReadyCheck: false,
});

redis.on("connect", () => {
  console.log("✅ Redis connected");
});

redis.on("error", (err) => {
  console.error("❌ Redis error", err);
});

export default redis;
