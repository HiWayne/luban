import { notification } from 'antd';
import JSEncrypt from 'jsencrypt';

export const encode = async (value: string) => {
  if (value && typeof value === 'string') {
    const publicKey: string = await fetch('/api/get/publickey/')
      .then((response) => response.text())
      .catch(() => {
        return null;
      });
    if (publicKey) {
      // 公钥 setPublicKey。密钥必须是这种格式setKey('-----BEGIN PRIVATE KEY-----MIICdFCQBj...中间省略...D3t4NbK1bqMA=-----END PRIVATE KEY-----')
      const jSEncrypt = new JSEncrypt();
      jSEncrypt.setPublicKey(publicKey);
      const enc = jSEncrypt.encrypt(value);
      if (enc) {
        return btoa(enc);
      } else {
        notification.error({
          message: '加密失败',
        });
        return Promise.reject('加密失败');
      }
    } else {
      notification.error({
        message: '密钥获取失败',
      });
      return Promise.reject('密钥获取失败');
    }
  } else {
    notification.warning({
      message: 'encode值不能为空',
    });
    return Promise.reject('encode值不能为空');
  }
};
