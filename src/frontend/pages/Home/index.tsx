import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Modal } from 'antd';
import { Flex, HeaderBar } from '@/frontend/components';
import { HEADER_BAR_HEIGHT } from '@/frontend/style';

const Entries = styled(({ className, children }) => (
  <Flex className={className} justifyContent="center">
    {children}
  </Flex>
))`
  padding-top: 200px;
  height: calc(100vh - ${HEADER_BAR_HEIGHT});
  gap: 20px;
`;

const Entry = styled.div`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 200px;
  height: 60px;
  background-color: #fff;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 3%), 0 1px 6px -1px rgb(0 0 0 / 2%),
    0 2px 4px 0 rgb(0 0 0 / 2%);
  border-radius: 12px;
  color: rgba(0, 0, 0, 0.88);
  cursor: pointer;
  transition: all 0.3s ease-out;
  &:hover {
    /* background-color: rgba(254, 254, 254, 0.6); */
    box-shadow: 0 4px 6px 0 rgb(0 0 0 / 6%), 0 4px 12px -1px rgb(0 0 0 / 4%),
      0 6px 8px 0 rgb(0 0 0 / 4%);
  }
`;

const Home = () => {
  const [modalShow, setShow] = useState(false);
  const [createType, setType] = useState('');

  const open = useCallback(() => {
    setShow(true);
  }, []);

  const close = useCallback(() => {
    setType('');
    setShow(false);
  }, []);

  const navigate = useNavigate();

  return (
    <div>
      <HeaderBar />
      <Entries>
        <Entry
          onClick={() => {
            setType('page');
            open();
          }}>
          创建页面
        </Entry>
        <Entry
          onClick={() => {
            setType('template');
            open();
          }}>
          创建模板
        </Entry>
      </Entries>
      <Modal
        width={480}
        style={{
          backgroundColor: '#f5f5f9',
          top: '-50px',
          borderRadius: '12px',
        }}
        open={modalShow}
        onCancel={close}
        footer={null}
        centered
        closable={false}>
        <Flex justifyContent="space-between">
          <Entry
            onClick={() => {
              close();
              navigate(`/editor?type=${createType}&ui=toc`);
            }}>
            移动端页面
          </Entry>
          <Entry
            onClick={() => {
              close();
              navigate(`/editor?type=${createType}&ui=tob`);
            }}>
            pc后台页面
          </Entry>
        </Flex>
      </Modal>
    </div>
  );
};

export default Home;
