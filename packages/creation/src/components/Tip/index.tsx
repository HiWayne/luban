import { FunctionComponent } from 'react';
import { Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

interface TipProps {
  title: string;
}

const Tip: FunctionComponent<TipProps> = ({ title }) => (
  <Tooltip title={title} color="blue">
    <QuestionCircleOutlined />
  </Tooltip>
);

export default Tip;
