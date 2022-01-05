import { FunctionComponent } from 'react';
import styled from '@emotion/styled';
import { ComponentLevel } from 'core/src/types/types';
import { UnitComponent } from './Configure/index';
import Panel from '@creation/components/Panel';

const MenuItem = styled.button`
  display: inline-block;
  line-height: 1;
  white-space: pre-wrap;
  cursor: pointer;
  background: #fff;
  border: 1px solid #dcdfe6;
  color: #606266;
  -webkit-appearance: none;
  text-align: center;
  box-sizing: border-box;
  outline: none;
  margin: 0;
  transition: 0.1s;
  font-weight: 500;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  padding: 12px 20px;
  font-size: 14px;
  border-radius: 4px;

  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;

  &:hover,
  &.active {
    color: #409eff;
    border-color: #c6e2ff;
    background-color: #ecf5ff;
  }
`;

const MenuList = styled.section`
  display: grid;
  grid-template-columns: repeat(2, 100px);
  grid-template-rows: repeat(auto-fill, 60px);
  gap: 10px;
`;

export interface Menu {
  name: string;
  levels: ComponentLevel[];
  props: { basic: any; advanced: any };
  key: string;
  component: UnitComponent;
}

interface MenusProps {
  data: Menu[];
  selectedMenu: Menu;
  onSelect: React.Dispatch<React.SetStateAction<Menu>>;
}

const Menus: FunctionComponent<MenusProps> = ({ data, selectedMenu, onSelect }) => {
  return (
    <Panel width={380} style={{ marginLeft: '10px' }}>
      <MenuList style={{ height: 'calc(100vh - 120px)', overflowY: 'auto' }}>
        {data.map((item) => (
          <MenuItem
            key={item.name}
            className={selectedMenu && selectedMenu.key === item.key ? 'active' : ''}
            onClick={() => {
              if (!selectedMenu || selectedMenu.key !== item.key) {
                onSelect(item);
              }
            }}
          >
            {item.name}
          </MenuItem>
        ))}
      </MenuList>
    </Panel>
  );
};

export default Menus;
