import { FunctionComponent } from 'react';
import { ColumnNames } from '@core/types/types';
import { definePropertyOfName } from '@core/utils/index';

interface TextProps {
  data: string;
}

const Text: FunctionComponent<TextProps> = ({ data }) => {
  if (typeof data === 'string') {
    return <span>{data}</span>;
  } else {
    console.error(`data of props should be string, but got "${typeof data}" in column text`);
    return null;
  }
};

definePropertyOfName(Text, ColumnNames.TEXT);

export default Text;
