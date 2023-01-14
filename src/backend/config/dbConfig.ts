export const redisConfig = {
  url: 'redis://0.0.0.0:6379',
};

export const mongoConfig = {
  url: 'mongodb://0.0.0.0:27017?retryWrites=true&w=majority',
  dbName: 'luban',
  templateCollectionName: 'templates',
  deployCollectionName: 'deploy',
  userCollectionName: 'user',
  userIdCollectionName: 'userId',
};
