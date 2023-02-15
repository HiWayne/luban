import fs from 'fs';

export const clearDir = (filePath: string) => {
  const files = fs.readdirSync(filePath);
  files.forEach((file) => {
    const nextFilePath = `${filePath}/${file}`;
    const states = fs.statSync(nextFilePath);
    if (states.isDirectory()) {
      clearDir(nextFilePath);
    } else {
      fs.unlinkSync(nextFilePath);
    }
  });
};
