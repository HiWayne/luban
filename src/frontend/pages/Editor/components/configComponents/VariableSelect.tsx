import { Select } from 'antd';
import { FC, useMemo } from 'react';
import { createScopeManager, Scope } from '../../utils';

interface VariableSelectProps {
  scopeIndex: number;
  scopeName?: string;
  defaultVariableName?: string;
  onChange: (value: string) => void;
}

const scopeManager = createScopeManager();

export const VariableSelect: FC<VariableSelectProps> = ({
  scopeIndex,
  scopeName,
  defaultVariableName,
  onChange,
}) => {
  const options = useMemo(() => {
    const scopes = scopeManager.get(scopeIndex, scopeName) as Scope[];
    return scopes.map((scope) =>
      scope.variables
        .map((variable) => ({
          label: variable.variableName,
          value: variable.variableName,
        }))
        .flat(),
    );
  }, [scopeIndex, scopeName]);

  return (
    <Select
      defaultValue={defaultVariableName}
      options={options}
      onChange={onChange}
    />
  );
};
