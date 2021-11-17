import { FunctionComponent } from 'react';
import * as Columns from './Columns/index';
import { ComponentsObject } from 'types/types';
import { getNameProperty } from 'utils/index';

interface TableColumnRenderProps {
  data: any;
  value: any;
}

const TableColumnRender: FunctionComponent<TableColumnRenderProps> = ({ data, value }) => {
  const [Column] =
    Object.keys(Columns)
      .map((key) => (Columns as ComponentsObject)[key])
      .filter((component) => getNameProperty(component) === data.name) || [];
  if (Column !== undefined) {
    return <Column data={value} />;
  } else {
    console.error(`column name "${data.name}" is not a valid name in BasicTable`);
    return null;
  }
};

export default TableColumnRender;
