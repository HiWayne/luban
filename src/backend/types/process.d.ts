export {};

declare global {
  namespace NodeJS {
    interface Process {
      context: {
        redis: RedisClientType<{} & RedisModules, RedisFunctions, RedisScripts>;
      };
    }
  }
}
