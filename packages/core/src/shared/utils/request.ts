import { default as _axios } from 'axios';
import { notification } from 'antd';

const axios = _axios.create({
  withCredentials: true,
});

const createNotification = (type: string) => (title?: string, message?: string) => {
  // @ts-ignore
  notification[type]({
    message: title,
    description: message,
    duration: 4,
  });
};

const openNotificationWithSuccess = createNotification('success');
const openNotificationWithError = createNotification('error');

const request =
  (method: string) =>
  (url: string, params: any, notify = true) => {
    console.warn(`${method} ${url}, params:`);
    console.warn(params);
    switch (method) {
      case 'get':
      case 'delete':
        params = { params };
        break;
    }
    // @ts-ignore
    return axios[method](url, params)
      .then((response: any) => {
        if (response?.status === 200) {
          if (notify) {
            openNotificationWithSuccess('请求成功');
          }
          return response.data;
        } else {
          if (notify) {
            openNotificationWithError('请求失败', `${method} ${url}`);
          }
          return Promise.reject({
            status: response?.status,
            message: response?.statusText,
          });
        }
      })
      .catch((error: any) => {
        if (notify) {
          openNotificationWithError('请求失败', `${method} ${url}`);
        }
        return Promise.reject(error);
      });
  };

export default request;
