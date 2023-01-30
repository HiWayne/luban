import { FormatSearchUsersRequestDTO, SearchUsersRequestDTO } from '../types';

export const verifySearchUsers = (params: SearchUsersRequestDTO) => {
  const formatParams: FormatSearchUsersRequestDTO = {
    start: 0,
    limit: 25,
  };
  if (params.ids) {
    formatParams.ids = params.ids.split(',').map((s) => Number(s));
  }
  if (params.name) {
    formatParams.name = params.name;
  }
  if (params.create_time_start) {
    formatParams.create_time_start = Number(params.create_time_start);
  }
  if (params.create_time_end) {
    formatParams.create_time_end = Number(params.create_time_end);
  }
  if (params.start) {
    formatParams.start = Number(params.start);
  }
  if (params.limit) {
    formatParams.limit = Number(params.limit);
  }
  return formatParams;
};
