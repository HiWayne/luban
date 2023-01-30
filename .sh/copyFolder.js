const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);

/**
 * @param { copiedPath: string } (被复制文件夹的地址，可以是相对地址)
 * @param { targetPath: string } (目标文件夹的地址，可以是相对地址)
 * @param { absolute: boolean } （是否是绝对地址）
 */
const copyFolder = (copiedPath, targetPath, absolute) => {
  if (typeof copiedPath !== 'string' || typeof targetPath !== 'string') {
    throw new Error('必须有被复制地址和放置地址');
  }
  if (!absolute) {
    copiedPath = path.join(__dirname, '../', copiedPath);
    targetPath = path.join(__dirname, '../', targetPath);
  }

  const createDir = (dirPath) => {
    fs.mkdirSync(dirPath);
  };

  if (fs.existsSync(copiedPath)) {
    if (!fs.existsSync(targetPath)) {
      createDir(targetPath);
    }
    /**
     * @des 方式一：利用子进程操作命令行方式
     */
    // child_process.spawn('cp', ['-r', copiedPath, targetPath])

    /**
     * @des 方式二：
     */
    const files = fs.readdirSync(copiedPath, { withFileTypes: true });
    for (let i = 0; i < files.length; i++) {
      const cf = files[i];
      const ccp = path.join(copiedPath, cf.name);
      const crp = path.join(targetPath, cf.name);
      if (cf.isFile()) {
        /**
         * @des 创建文件,使用流的形式可以读写大文件
         */
        const readStream = fs.createReadStream(ccp);
        const writeStream = fs.createWriteStream(crp);
        readStream.pipe(writeStream);
      } else {
        try {
          /**
           * @des 判断读(R_OK | W_OK)写权限
           */
          fs.accessSync(path.join(crp, '..'), fs.constants.W_OK);
          copyFolder(ccp, crp, true);
        } catch (error) {
          console.log('folder write error:', error);
        }
      }
    }
  } else {
    console.log('do not exist path: ', copiedPath);
  }
};

copyFolder(...args);
