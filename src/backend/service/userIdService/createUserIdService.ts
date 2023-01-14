import { mongoConfig } from '@/backend/config';

interface UserIdEntity {
  id: 'USER_ID_ID';
  value: number;
}

const ID = 'USER_ID_ID';

export const createUserIdService = async (session: any) => {
  try {
    const mongodb = process.dbContext.mongo;
    const db = mongodb.db(mongoConfig.dbName);
    const collection = db.collection(mongoConfig.userIdCollectionName);
    const data: UserIdEntity = await collection.findOne(
      { id: ID },
      { session },
    );
    if (data) {
      const id = data.value + 1;
      const result = await collection.updateOne(
        { id: ID },
        { value: id },
        { session },
      );
      if (result.acknowledged) {
        return id;
      } else {
        throw new Error('id服务异常');
      }
    } else {
      const result = await collection.insertOne(
        { id: ID, value: 1 },
        { session },
      );
      if (result.acknowledged) {
        return 1;
      } else {
        throw new Error('id服务异常');
      }
    }
  } catch (e) {
    return Promise.reject(`${e}`);
  }
};
