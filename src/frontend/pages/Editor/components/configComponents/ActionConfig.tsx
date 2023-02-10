import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { produce } from 'immer';
import { Button, Card, Form, Input, Select } from 'antd';
import { Flex } from '@/frontend/components';
import { Action, ActionType } from '@/backend/types';

type Type = Exclude<ActionType, 'PaginationStartCompute'> | '';

interface NavigateConfigProps {
  navigateUrl: string;
  setNavigateUrl: (value: string) => void;
  navigateMethod: '_blank' | 'self';
  setNavigateMethod: (value: '_blank' | 'self') => void;
}

const NavigateConfig: FC<NavigateConfigProps> = ({
  navigateUrl,
  setNavigateUrl,
  navigateMethod,
  setNavigateMethod,
}) => {
  const navigateMethodsOptions = useMemo(
    () => [
      {
        label: '新开页面',
        value: '_blank',
      },
      {
        label: '替换当前页',
        value: 'self',
      },
    ],
    [],
  );

  return (
    <>
      <Form.Item label="跳转链接">
        <Input
          value={navigateUrl}
          onChange={(e) => setNavigateUrl(e.target.value)}
        />
      </Form.Item>
      <Form.Item label="跳转方式">
        <Select
          style={{ width: '150px' }}
          value={navigateMethod}
          onChange={setNavigateMethod}
          options={navigateMethodsOptions}
        />
      </Form.Item>
    </>
  );
};

const FetchConfig = () => {
  return null;
};

const InteractConfig = () => {
  return null;
};

const ConfigMap = {
  Navigate: NavigateConfig,
  Fetch: FetchConfig,
  Interact: InteractConfig,
  '': () => null,
};

interface ComponentAction {
  actionType: Type;
  navigateUrl: string;
  navigateMethod: '_blank' | 'self';
}

export type ActionPropConfig = ComponentAction[];

interface ActionConfigProps {
  defaultActions?: ComponentAction[];
  onChange: (
    data: { prop?: Action; propConfig: ActionPropConfig } | null,
  ) => void;
}

const createInitialComponentAction = (): ComponentAction => ({
  actionType: '',
  navigateUrl: '',
  navigateMethod: '_blank',
});

export const ActionConfig: FC<ActionConfigProps> = ({
  defaultActions,
  onChange,
}) => {
  const [actions, setActions] = useState<ComponentAction[]>(
    defaultActions || [createInitialComponentAction()],
  );

  useEffect(() => {
    if (actions.length > 0) {
      let actionProp: Action | undefined;
      let prevAction: Action | undefined;
      actions.forEach((action, index) => {
        switch (action.actionType) {
          case 'Navigate':
            const currentNavigateAction = {
              type: action.actionType,
              data: {
                url: action.navigateUrl,
                method: action.navigateMethod,
              },
            };
            if (index === 0) {
              actionProp = currentNavigateAction;
              prevAction = currentNavigateAction;
            } else if (prevAction) {
              prevAction!.next = currentNavigateAction;
              prevAction = currentNavigateAction;
            } else {
              actionProp = currentNavigateAction;
              prevAction = currentNavigateAction;
            }
            break;
          default:
            break;
        }
      });
      onChange({
        prop: actionProp,
        propConfig: actions,
      });
    } else {
      onChange({
        prop: undefined,
        propConfig: actions,
      });
    }
  }, [actions]);

  const configRender = useCallback(
    (index: number) => {
      const Config = ConfigMap[actions[index].actionType];
      switch (actions[index].actionType) {
        case 'Navigate':
          return (
            <Config
              navigateUrl={actions[index].navigateUrl}
              setNavigateUrl={(url) => {
                setActions(
                  produce(actions, (draft) => {
                    draft[index].navigateUrl = url;
                  }),
                );
              }}
              navigateMethod={actions[index].navigateMethod}
              setNavigateMethod={(method) => {
                setActions(
                  produce(actions, (draft) => {
                    draft[index].navigateMethod = method;
                  }),
                );
              }}
            />
          );
        default:
          return null;
      }
    },
    [actions],
  );

  const options = useMemo(
    () => [
      {
        label: '无',
        value: '',
      },
      {
        label: '点击跳转',
        value: 'Navigate',
      },
      {
        label: '发起请求',
        value: 'Fetch',
      },
      {
        label: '页面交互',
        value: 'Interact',
      },
    ],
    [],
  );

  return (
    <Flex direction="column" alignItems="flex-start">
      <Button
        type="primary"
        style={{ marginBottom: '12px' }}
        onClick={() => {
          setActions([...actions, createInitialComponentAction()]);
        }}>
        新增行为
      </Button>
      <Flex direction="column">
        {actions.map((action, index) => (
          <Card
            key={index}
            hoverable
            style={{ width: '300px', marginBottom: '12px' }}>
            <Flex direction="column" alignItems="flex-start">
              <Select
                style={{ marginBottom: '24px', width: '120px' }}
                value={action.actionType}
                onChange={(type) => {
                  setActions(
                    produce(actions, (draft) => {
                      draft[index].actionType = type;
                    }),
                  );
                }}
                options={options}
              />
              {configRender(index)}
              <Button
                size="small"
                danger
                onClick={() => {
                  setActions(
                    produce(actions, (draft) => {
                      draft.splice(index, 1);
                    }),
                  );
                }}>
                删除该行为
              </Button>
            </Flex>
          </Card>
        ))}
      </Flex>
    </Flex>
  );
};
