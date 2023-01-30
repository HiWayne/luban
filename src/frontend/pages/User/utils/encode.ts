import JSEncrypt from 'jsencrypt';

export const encode = (value: string) => {
  if (value && typeof value === 'string') {
    // 公钥 setPublicKey。密钥必须是这种格式setKey('-----BEGIN PRIVATE KEY-----MIICdFCQBj...中间省略...D3t4NbK1bqMA=-----END PRIVATE KEY-----')
    const jSEncrypt = new JSEncrypt();
    jSEncrypt.setPublicKey(
      '-----BEGIN PUBLIC KEY-----MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAMA8kdrLsuuat9gpfhaUMoNaUv+OztDcWnPoOc/cROL/0JFX0RXSmj9IQJHj5XkOy543J9uYEYCLpv4segpOLD0CAwEAAQ==-----END PUBLIC KEY-----',
    );
    const enc = jSEncrypt.encrypt(value);
    if (enc) {
      return btoa(enc);
    } else {
      throw new Error('加密失败');
    }
  } else {
    return value;
  }
};
