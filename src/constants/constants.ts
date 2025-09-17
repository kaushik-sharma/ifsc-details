import { Duration } from "luxon";

export class Constants {
  // TTL Tokens
  static readonly redisIfscRecordTTL = Duration.fromObject({
    days: 1,
  });
  static readonly mongodbIfscRecordTTL = Duration.fromObject({
    days: 30,
  });

  // Rate Limiter
  static readonly defaultRateLimiterWindowMs = Duration.fromObject({
    minutes: 10,
  }).as("milliseconds");
  static readonly defaultRateLimiterMax = 100;
}
