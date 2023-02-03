import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button, List } from 'antd';
import VirtualList from 'rc-virtual-list';
import { DtIcon } from '@duitang/dt-react-mobile';
import { Avatar, Flex } from '@/frontend/components';
import { useGetTemplatesApi } from '../api';
import { NodeAST } from '@/frontend/types';
import { useModifyPage } from '../hooks';

const ContainerHeight = 400;

const TemplateName = styled.h3`
  margin: 0;
  padding: 0;
  font-size: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const TemplateDesc = styled.p`
  display: -webkit-box;
  margin: 4px 0;
  padding: 0;
  font-size: 12px;
  color: #666;
  overflow: hidden;
  word-break: break-all;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const UserName = styled.span`
  font-size: 12px;
`;

const ApplyButton = ({ templateId }: { templateId: string }) => {
  const [loading, setLoading] = useState(false);

  const { getTemplateDetail } = useGetTemplatesApi();
  const { addComponentFromTemplate } = useModifyPage();

  return (
    <Button
      loading={loading}
      style={{ marginLeft: '20px' }}
      onClick={() => {
        setLoading(true);
        getTemplateDetail(templateId)
          .then((templateDetail) => {
            if (templateDetail) {
              addComponentFromTemplate(
                templateDetail.view as NodeAST[],
                templateDetail.config,
              );
            }
          })
          .finally(() => {
            setLoading(false);
          });
      }}>
      应用模板
    </Button>
  );
};

export const TemplateList = styled(({ className }) => {
  const { templates, getTemplates } = useGetTemplatesApi();

  useEffect(() => {
    getTemplates();
  }, []);

  const onScroll = useCallback((e: React.UIEvent<HTMLElement, UIEvent>) => {
    if (
      e.currentTarget.scrollHeight - e.currentTarget.scrollTop ===
      ContainerHeight
    ) {
      getTemplates();
    }
  }, []);

  return (
    <List dataSource={templates} className={className}>
      <VirtualList
        data={templates}
        height={ContainerHeight}
        itemHeight={47}
        itemKey="id"
        onScroll={onScroll}>
        {(template) => (
          <Flex
            style={{ margin: '8px 0' }}
            justifyContent="flex-start"
            alignItems="center">
            <DtIcon src={template.preview} />
            <Flex
              style={{ marginLeft: '12px', height: '100px' }}
              direction="column"
              justifyContent="space-between"
              alignItems="flex-start">
              <TemplateName>{template.name}</TemplateName>
              <TemplateDesc>{template.desc}</TemplateDesc>
              <Flex justifyContent="flex-start" alignItems="center">
                <Avatar size="small" src={template.author.author_avatar} />
                <UserName>{template.author.author_name}</UserName>
              </Flex>
            </Flex>
            <ApplyButton templateId={template.id} />
          </Flex>
        )}
      </VirtualList>
    </List>
  );
})`
  height: 400px;
  overflow: auto;
  padding: 0 16px;
  border: 1px solid rgba(140, 140, 140, 0.35);
  font-size: 0;
  user-select: none;
`;
