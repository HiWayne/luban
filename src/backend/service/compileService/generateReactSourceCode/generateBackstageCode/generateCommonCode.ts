export const generateCommonCodeOfBackstage = () => {
  return `
        notification.config({
            placement: 'topRight',
            duration: 3,
        });

        const axiosInstance = axios.create({
            timeout: 20000,
            withCredentials: true,
        });

        axiosInstance.interceptors.request.use(function (config) {
            return config;
        }, function (error) {
            notification.error({
                message: 'request error',
                description: <p>{error.config.url}请求失败, 错误信息: {error.message}</p>
            })
            return Promise.reject(error);
        });

        axiosInstance.interceptors.response.use(function (response) {
            return response.data;
        }, function (error) {
            notification.error({
                message: 'response error',
                description: <p>{error.config.url}返回失败, 错误信息: {error.message}</p>
            })
            return Promise.reject(error);
        });

        const request = {
            GET(url, params) {
                return axiosInstance({
                    url,
                    method: 'get',
                    params,
                })
            },
            POST(url, data, params) {
                return axiosInstance({
                    url,
                    method: 'post',
                    data,
                    params,
                })
            },
            PUT(url, data, params) {
                return axiosInstance({
                    url,
                    method: 'put',
                    data,
                    params,
                })
            },
            DELETE(url, data, params) {
                return axiosInstance({
                    url,
                    method: 'get',
                    data,
                    params,
                })
            }
        }
    `;
};

export const generateCommonCodeOfFrontstage = () => {
  return `  
          const axiosInstance = axios.create({
              timeout: 20000,
              withCredentials: true,
          });
  
          axiosInstance.interceptors.request.use(function (config) {
              return config;
          }, function (error) {
              return Promise.reject(error);
          });
  
          axiosInstance.interceptors.response.use(function (response) {
              return response.data;
          }, function (error) {
              return Promise.reject(error);
          });
  
          const request = {
              GET(url, params) {
                  return axiosInstance({
                      url,
                      method: 'get',
                      params,
                  })
              },
              POST(url, data, params) {
                  return axiosInstance({
                      url,
                      method: 'post',
                      data,
                      params,
                  })
              },
              PUT(url, data, params) {
                  return axiosInstance({
                      url,
                      method: 'put',
                      data,
                      params,
                  })
              },
              DELETE(url, data, params) {
                  return axiosInstance({
                      url,
                      method: 'get',
                      data,
                      params,
                  })
              }
          }
      `;
};
