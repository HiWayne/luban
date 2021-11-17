import { FunctionComponent } from 'react';
import { ColumnNames } from 'types/types';
import { definePropertyOfName } from 'utils/index';

interface Data {
  text: string;
  href: string;
}

interface AProps {
  data: Data;
}

const A: FunctionComponent<AProps> = ({ data }) => {
  const { text, href } = data || {};
  if (typeof text === 'string' && typeof href === 'string') {
    return (
      <a href={href} target="_blank" rel="noreferrer">
        {text}
      </a>
    );
  } else {
    console.error(
      `data.text and data.href of props should be string, but got "${typeof text} ${typeof href}" in column a`,
    );
    return null;
  }
};

definePropertyOfName(A, ColumnNames.A);

export default A;
