import { Form, Input } from 'antd';
import Tip from '@creation/components/Tip';

const { Item } = Form;

const Number = ({ value, onChange, name, tip }: { value: any; onChange: any; name: string; tip: string }) => {
  console.log(name, tip);
  return (
    <Item label={name}>
      {tip ? <Tip title={tip} /> : null}
      <Input type="number" value={value} onChange={onChange} style={{ marginLeft: '10px', width: '100px' }} />
    </Item>
  );
};

export default Number;
