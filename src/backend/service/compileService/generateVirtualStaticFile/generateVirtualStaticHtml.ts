export const generateVirtualStaticHtml = async (name: string) => {
  if (name) {
    try {
      const html = await process.dbContext.redis.HGET(name, 'html');
      return html;
    } catch {
      return Promise.reject('读取html失败');
    }
  } else {
    return Promise.reject('缺少文件名');
  }
};
