import { Form, Input } from 'antd';
import { Tip } from '@creation/components/index';

const { Item } = Form;

const String = ({ value, onChange, name, tip }: { value: any; onChange: any; name: string; tip: string }) => {
  return (
    <Item label={name}>
      {tip ? <Tip title={tip} /> : null}
      <Input value={value} onChange={onChange} style={{ marginLeft: '10px', width: '150px' }} />
    </Item>
  );
};

export default String;
