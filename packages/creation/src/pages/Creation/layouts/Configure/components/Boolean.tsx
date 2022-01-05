import { Form, Checkbox } from 'antd';
import Tip from '@creation/components/Tip';

const { Item } = Form;

const Boolean = ({ value, onChange, name, tip }: { value: any; onChange: any; name: string; tip: string }) => {
  console.log(name, tip);
  return (
    <Item label={name}>
      {tip ? <Tip title={tip} /> : null}
      <Checkbox checked={value} onChange={onChange} style={{ marginLeft: '10px' }} />
    </Item>
  );
};

export default Boolean;
