import { FunctionComponent } from 'react';
import { Tag } from 'antd';
import { ColumnNames } from 'types/types';
import { definePropertyOfName } from 'utils/index';

interface TagsProps {
  data: string[];
}

const Tags: FunctionComponent<TagsProps> = ({ data }) => {
  if (Array.isArray(data)) {
    return (
      <>
        {data.map((item) => (
          <Tag color="#2db7f5">{item}</Tag>
        ))}
      </>
    );
  } else {
    console.error(`data of props should be array, but got "${typeof data}" in column tags`);
    return null;
  }
};

definePropertyOfName(Tags, ColumnNames.TAGS);

export default Tags;
