import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Form,
  Input,
  Modal,
  Switch,
  Tag,
  theme,
  Tooltip,
  Avatar as AntdAvatar,
  Select,
  notification,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { InputRef } from 'antd';
import { TweenOneGroup } from 'rc-tween-one';
import { debounce, getParams } from '@duitang/dt-base';
import { Avatar, Loading } from '@/frontend/components';
import { UserResponseDTO } from '@/backend/service/userService/types';
import { useSearchUsers } from './api';
import { SaveTemplateRequestDTO } from '@/backend/service/templateService/types';
import useStore from '@/frontend/store';
import { UploadImageConfig } from '../configComponents/UploadImageConfig';
import { findConfigFromMap } from '../../utils';
import { iterateNodeAST } from '../../utils/operateNodeAST';
import { NodeAST } from '@/frontend/types';

interface TagsProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

const Tags: FC<TagsProps> = ({ tags, onChange }) => {
  const { token } = theme.useToken();
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<InputRef>(null);

  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, []);

  const handleClose = (removedTag: string) => {
    const newTags = tags.filter((tag) => tag !== removedTag);
    onChange(newTags);
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value.trim());
  };

  const handleInputConfirm = () => {
    if (inputValue && tags.indexOf(inputValue) === -1) {
      const newTags = [...tags, inputValue];
      onChange(newTags);
    }
    setInputVisible(false);
    setInputValue('');
  };

  const forMap = (tag: string) => {
    const tagElem = (
      <Tag
        closable
        onClose={(e) => {
          e.preventDefault();
          handleClose(tag);
        }}>
        {tag}
      </Tag>
    );
    return (
      <span key={tag} style={{ display: 'inline-block', userSelect: 'none' }}>
        {tagElem}
      </span>
    );
  };

  const tagChild = useMemo(() => tags.map(forMap), [tags]);

  const tagPlusStyle = {
    background: token.colorBgContainer,
    borderStyle: 'dashed',
  };

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        {/* <TweenOneGroup
          enter={{
            scale: 0.8,
            opacity: 0,
            type: 'from',
            duration: 100,
          }}
          onEnd={(e) => {
            if (e.type === 'appear' || e.type === 'enter') {
              (e.target as any).style = 'display: inline-block';
            }
          }}
          leave={{ opacity: 0, width: 0, scale: 0, duration: 200 }}
          appear={false}></TweenOneGroup> */}
        {tagChild}
      </div>
      {inputVisible ? (
        <Input
          ref={inputRef}
          type="text"
          size="small"
          style={{ width: 78 }}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputConfirm}
          onPressEnter={handleInputConfirm}
          autoFocus
        />
      ) : (
        <Tag onClick={showInput} style={tagPlusStyle}>
          <PlusOutlined /> New Tag
        </Tag>
      )}
    </>
  );
};

interface TemplateConfigProps {
  open: boolean;
  onCancel: () => void;
  onOk: (templateData: SaveTemplateRequestDTO) => void;
  type: 'create' | 'update';
}

export const TemplateConfig: FC<TemplateConfigProps> = ({
  open,
  onCancel,
  onOk,
  type,
}) => {
  const pageViewModel = useStore(
    (store) => store.editor.pageModel?.view,
  ) as NodeAST;
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [isPublic, setPublic] = useState(true);
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [tags, setTags] = useState<string[]>([]);
  const [preview, setPreview] = useState('');
  const [collaborators, setCollaborators] = useState<UserResponseDTO[]>([]);
  const [selectValue, setSelectValue] = useState<number[]>([]);
  const [searchLoading, setLoading] = useState(false);

  const { users, usersMap, searchUsers } = useSearchUsers();

  const pageType = useMemo(() => getParams().ui as 'toc' | 'tob', []);

  const searchResultList = useMemo(
    () =>
      users.map((user) => ({
        label: user.name,
        value: user.id,
      })),
    [users],
  );

  const debounceSearch = useCallback(
    debounce((value: string) => {
      searchUsers(value).finally(() => {
        setLoading(false);
      });
    }, 800),
    [],
  );

  const handleSearch = useCallback((value: string) => {
    setLoading(true);
    debounceSearch(value);
  }, []);

  const handleSearchConfirm = useCallback(
    (ids: number[]) => {
      if (!ids.slice(0, -1).some((id) => id === ids[ids.length - 1])) {
        setSelectValue(ids);
        setCollaborators((origin) => {
          if (ids.length > 0) {
            return [
              ...origin,
              usersMap.get(ids[ids.length - 1]) as UserResponseDTO,
            ];
          } else {
            return [];
          }
        });
      }
    },
    [users],
  );

  const handleOk = useCallback(() => {
    if (!pageViewModel || !pageViewModel.children?.length) {
      notification.error({
        message: '模板内容不能为空',
      });
      return;
    }
    const config: Record<number, any> = {};
    let view;
    if (pageViewModel.children.length === 1) {
      view = pageViewModel.children[0];
    } else {
      view = pageViewModel;
    }
    iterateNodeAST(view, (nodeAST) => {
      config[nodeAST.id] = findConfigFromMap(nodeAST.id);
    });
    const templateData: SaveTemplateRequestDTO = {
      name,
      desc,
      private: !isPublic,
      status,
      tags,
      collaborators: collaborators.map((collaborator) => collaborator.id),
      type: pageType,
      view: { ...view, convergent: true } as any,
      config,
      preview: preview || undefined,
    };
    onOk(templateData);
  }, [name, desc, isPublic, status, tags, collaborators, preview, onOk]);

  return (
    <Modal open={open} onCancel={onCancel} onOk={handleOk}>
      <Form
        style={{ padding: '20px 0' }}
        labelCol={{ span: 4 }}
        labelAlign="left">
        <Form.Item label="预览图">
          <UploadImageConfig onChange={setPreview} />
        </Form.Item>
        <Form.Item label="模板名称">
          <Input
            value={name}
            onChange={(event) => {
              setName(event.target.value);
            }}
          />
        </Form.Item>
        <Form.Item label="模板描述">
          <Input
            value={desc}
            onChange={(event) => {
              setDesc(event.target.value);
            }}
          />
        </Form.Item>
        <Form.Item label="是否公开">
          否
          <Switch
            style={{ margin: '0 4px 0 4px' }}
            defaultChecked={isPublic}
            onChange={(result) => setPublic(result)}
          />
          是
        </Form.Item>
        <Form.Item label="生效状态">
          失效
          <Switch
            style={{ margin: '0 4px 0 4px' }}
            defaultChecked={status === 'active'}
            onChange={(result) => {
              setStatus(result ? 'active' : 'inactive');
            }}
          />
          生效
        </Form.Item>
        <Form.Item label="模板标签">
          <Tags tags={tags} onChange={setTags} />
        </Form.Item>
        <Form.Item label="邀请协作者">
          <AntdAvatar.Group
            style={{
              minWidth: '40px',
              minHeight: '40px',
            }}
            maxCount={2}
            maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
            size="large">
            {collaborators.map((collaborator) => (
              <Tooltip title="Ant User" placement="top" key={collaborator.id}>
                <Avatar size={32} src={collaborator.avatar} />
              </Tooltip>
            ))}
          </AntdAvatar.Group>
          <Select
            mode="multiple"
            value={selectValue}
            showSearch
            placeholder="输入用户名模糊搜索"
            defaultActiveFirstOption={false}
            showArrow={false}
            filterOption={false}
            onSearch={handleSearch}
            onChange={handleSearchConfirm}
            notFoundContent={searchLoading ? <Loading size="small" /> : null}
            options={searchResultList}
            loading={searchLoading}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
