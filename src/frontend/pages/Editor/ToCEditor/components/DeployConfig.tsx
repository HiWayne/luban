import { useEffect, useState } from 'react';
import { Button, Form, Input } from 'antd';
import useStore from '@/frontend/store';
import { DeployCategorySelect, PathInput } from '../../components';

export interface DeployData {
  category: string;
  category_name: string;
  path: string;
  desc: string;
}

export const DeployConfig = ({
  onChange,
}: {
  onChange: (data: DeployData) => void;
}) => {
  const [category, setCategory] = useState('');
  const [categoryName, setCategoryName] = useState('');

  const [path, setPath] = useState('');
  const [desc, setDesc] = useState('');

  const setPageMeta = useStore((store) => store.editor.setPageMeta);

  useEffect(() => {
    setPageMeta({
      path,
    });
    onChange({
      category,
      category_name: categoryName,
      path,
      desc: desc || '',
    });
  }, [category, categoryName, path, desc]);

  return (
    <Form>
      <Form.Item label="分类">
        <DeployCategorySelect
          category={category}
          setCategory={setCategory}
          setCategoryName={setCategoryName}
        />
        <Button
          onClick={() => {
            window.open('/deploy/categoryManage');
          }}>
          分类管理
        </Button>
      </Form.Item>
      <Form.Item label="路径" required>
        <PathInput onChange={setPath} />
      </Form.Item>
      <Form.Item label="发布描述">
        <Input.TextArea
          value={desc}
          onChange={(e) => {
            setDesc(e.target.value);
          }}
        />
      </Form.Item>
    </Form>
  );
};
