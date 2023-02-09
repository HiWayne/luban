import {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';
import { Button, Card, List, Tooltip } from 'antd';
import VirtualList from 'rc-virtual-list';
import { DtIcon } from '@duitang/dt-react-mobile';
import { Avatar, Flex } from '@/frontend/components';
import { useGetTemplatesApi } from '../api';
import { useModifyPage } from '../hooks';
import { DragContext } from '../ToCEditor/DragProvider';
import { TemplateBriefResponseDTO } from '@/backend/service/templateService/types';

const ContainerHeight = 400;

const TemplateName = styled.h3`
  margin: 0;
  padding: 0;
  width: 80px;
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
  font-size: 10px;
  width: 50px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ApplyButton = ({ templateId }: { templateId: string }) => {
  const [loading, setLoading] = useState(false);

  const { getTemplateDetail } = useGetTemplatesApi();
  const { addComponentFromTemplate } = useModifyPage();

  return (
    <Tooltip title="模板可拖动到指定位置，也可点击【应用模板】按钮添加到页面末尾">
      <Button
        loading={loading}
        style={{ marginLeft: '20px' }}
        onClick={() => {
          setLoading(true);
          getTemplateDetail(templateId)
            .then((templateDetail) => {
              if (templateDetail) {
                addComponentFromTemplate(templateDetail);
              }
            })
            .finally(() => {
              setLoading(false);
            });
        }}>
        应用模板
      </Button>
    </Tooltip>
  );
};

const ListCard = styled(
  forwardRef(
    (
      {
        template,
        className,
      }: { template: TemplateBriefResponseDTO; className?: string },
      ref,
    ) => {
      const [loading, setLoading] = useState(false);
      const cardRef = useRef<HTMLDivElement>(null);

      const { getTemplateDetail } = useGetTemplatesApi();

      const { onDragStart, onDragEnd, onDragOver } = useContext(DragContext)!;

      const handleDragStart = useCallback(function (
        this: HTMLElement,
        event: DragEvent,
      ) {
        setLoading(true);
        const awaitTemplateDetail = getTemplateDetail(template.id)
          .then((templateDetail) => {
            setLoading(false);
            return templateDetail;
          })
          .catch(() => {
            setLoading(false);
            return null;
          });
        onDragStart.call(this, event, awaitTemplateDetail);
      },
      []);

      useEffect(() => {
        if (cardRef.current) {
          cardRef.current.addEventListener('dragstart', handleDragStart);
          cardRef.current.addEventListener('dragover', onDragOver);
          cardRef.current.addEventListener('dragend', onDragEnd);

          return () => {
            cardRef.current?.removeEventListener('dragstart', handleDragStart);
            cardRef.current?.removeEventListener('dragover', onDragOver);
            cardRef.current?.removeEventListener('dragend', onDragEnd);
          };
        }
      }, []);

      return (
        <Card
          hoverable
          draggable
          ref={cardRef}
          style={{ padding: '8px', cursor: 'grab' }}
          className={className}>
          <Flex justifyContent="flex-start" alignItems="center" ref={ref}>
            <DtIcon width="80px" src={template.preview} />
            <Flex
              style={{ marginLeft: '12px', height: '100px' }}
              direction="column"
              justifyContent="space-around"
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
        </Card>
      );
    },
  ),
)`
  & > .ant-card-body {
    padding: 0;
  }
`;

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
        {(template) => <ListCard template={template} />}
      </VirtualList>
    </List>
  );
})`
  height: 500px;
  overflow: auto;
  padding: 0 16px;
  border: 1px solid rgba(140, 140, 140, 0.35);
  font-size: 0;
  user-select: none;
`;
