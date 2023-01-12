export const generateVirtualStaticJson = async (name: string) => {
  if (name) {
    try {
      const json = await process.context.redis.HGET(name, 'json');
      return json;
    } catch {
      return Promise.reject();
    }
  } else {
    return Promise.reject();
  }
};
