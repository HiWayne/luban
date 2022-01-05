import { FunctionComponent } from 'react';
import dayjs from 'dayjs';
import { ColumnNames } from '@core/types/types';
import { definePropertyOfName } from '@core/utils/index';

interface TimeProps {
  data: string | number | Date;
}

const Time: FunctionComponent<TimeProps> = ({ data }) => {
  if (typeof data === 'string' || typeof data === 'number' || data instanceof Date) {
    if (!(typeof data === 'string' && isNaN(Number(data)))) {
      data = dayjs(data).format('YYYY-MM-DD HH:mm:ss');
    }
    return <span>{data}</span>;
  } else {
    console.error(`data of props should be string or number or Date, but got "${typeof data}" in column time`);
    return null;
  }
};

definePropertyOfName(Time, ColumnNames.TIME);

export default Time;
