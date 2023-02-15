import xss from 'xss';

export const verifyDeployRecordRequest = (params: any) => {
  if (!params) {
    return { start: 0, limit: 25 };
  }
  const formatParams = { ...params };
  if (!params.start) {
    formatParams.start = 0;
  } else {
    formatParams.start = Number(params.start);
  }
  if (!params.limit) {
    formatParams.limit = 25;
  } else {
    formatParams.limit = Number(params.limit);
  }
  if (params.category && typeof params.category === 'string') {
    if (/^[a-zA-Z\d]+$/.test(params.category)) {
      formatParams.category = params.category;
    } else {
      throw new Error('category不合法');
    }
  }
  if (params.path && typeof params.path === 'string') {
    if (/^[^/][a-zA-Z\d]*\/?[a-zA-Z\d]*[^/]$/.test(params.path)) {
      formatParams.path = params.path;
    } else {
      throw new Error('path不合法');
    }
  }
  if (params.update_time_start) {
    formatParams.update_time_start = Number(params.update_time_start);
  }
  if (params.update_time_end) {
    formatParams.update_time_end = Number(params.update_time_end);
  }
  if (params.desc && typeof params.desc === 'string') {
    formatParams.desc = xss(params.desc);
  }
  return formatParams;
};
