export {};

declare global {
  namespace NodeJS {
    interface Process {
      dbContext: {
        redis: RedisClientType<{} & RedisModules, RedisFunctions, RedisScripts>;
        mongo: MongoClient;
      };
    }
  }
}
