import { isExist } from '@duitang/dt-base';

interface Variable {
  variableName: string;
  variableValue: any;
  variableRaw: string;
  variableType:
    | 'string'
    | 'number'
    | 'function'
    | 'array'
    | 'object'
    | 'null'
    | 'undefined'
    | 'useState';
}

type ScopeStatus = 'public' | 'private';

interface Scope {
  scopeName: string;
  scopeStatus: ScopeStatus;
  variables: Variable[];
}

interface Scopes {
  scopes: Scope[];
}

export const createScopeManager = () => {
  let scopesContext: Scopes[] = [];
  return {
    // 获取变量或变量环境。获取variables时，也会获取底层栈的变量（沿着作用域链）
    get(scopeIndex?: number, scopeName?: string, variableName?: string) {
      try {
        if (
          !isExist(scopeIndex) &&
          !isExist(scopeName) &&
          !isExist(variableName)
        ) {
          return scopesContext;
        } else if (
          isExist(scopeIndex) &&
          !isExist(scopeName) &&
          !isExist(variableName)
        ) {
          return scopesContext[scopeIndex as number];
        } else if (
          isExist(scopeIndex) &&
          isExist(scopeName) &&
          !isExist(variableName)
        ) {
          return scopesContext
            .slice(0, (scopeIndex as number) + 1)
            .reverse()
            .reduce((allScopes, scopeContext, index) => {
              if (index === 0) {
                const targetScope = scopeContext.scopes.find(
                  (scope) => scope.scopeName === scopeName,
                );
                if (targetScope) {
                  allScopes.push(targetScope);
                }
                return allScopes;
              } else {
                allScopes.push(
                  ...scopeContext.scopes.filter(
                    (scope) => scope.scopeStatus === 'public',
                  ),
                );
                return allScopes;
              }
            }, [] as Scope[]);
        } else if (
          isExist(scopeIndex) &&
          isExist(scopeName) &&
          isExist(variableName)
        ) {
          return (
            scopesContext[scopeIndex as number].scopes
              .find((scope) => scope.scopeName === scopeName)
              ?.variables.find(
                (variable) => variable.variableName === variableName,
              ) || null
          );
        } else {
          return null;
        }
      } catch {
        return null;
      }
    },
    // 精准获取变量或变量环境，不会获取底层栈的变量
    getExactly(scopeIndex?: number, scopeName?: string, variableName?: string) {
      try {
        if (
          !isExist(scopeIndex) &&
          !isExist(scopeName) &&
          !isExist(variableName)
        ) {
          return scopesContext;
        } else if (
          isExist(scopeIndex) &&
          !isExist(scopeName) &&
          !isExist(variableName)
        ) {
          return scopesContext[scopeIndex as number];
        } else if (
          isExist(scopeIndex) &&
          isExist(scopeName) &&
          !isExist(variableName)
        ) {
          return scopesContext[scopeIndex as number].scopes.find(
            (scope) => scope.scopeName === scopeName,
          );
        } else if (
          isExist(scopeIndex) &&
          isExist(scopeName) &&
          isExist(variableName)
        ) {
          return (
            scopesContext[scopeIndex as number].scopes
              .find((scope) => scope.scopeName === scopeName)
              ?.variables.find(
                (variable) => variable.variableName === variableName,
              ) || null
          );
        } else {
          return null;
        }
      } catch {
        return null;
      }
    },
    // 在作用域栈顶新增环境并声明变量
    add(data: Variable, scopeName: string, _public?: boolean) {
      scopesContext.push({
        scopes: [
          {
            scopeName,
            variables: [{ ...data }],
            scopeStatus: _public ? 'public' : 'private',
          },
        ],
      });
      return scopesContext.length - 1;
    },
    // 在作用域栈环境中追加变量
    append(
      data: Variable,
      scopeName: string,
      scopeIndex?: number,
      _public?: boolean,
    ) {
      if (scopeIndex === undefined) {
        scopeIndex = scopesContext.length - 1;
      }
      const target = scopesContext[scopeIndex];
      if (target && Array.isArray(target.scopes)) {
        const targetScope = target.scopes.find(
          (scope) => scope.scopeName === scopeName,
        );
        if (targetScope) {
          targetScope.variables.push({ ...data });
        } else {
          return false;
        }
      } else {
        scopesContext[scopesContext.length - 1] = {
          scopes: [
            {
              scopeName,
              variables: [{ ...data }],
              scopeStatus: _public ? 'public' : 'private',
            },
          ],
        };
      }
      return scopesContext.length - 1;
    },
    // 删除变量
    remove(variableName: string, scopeIndex: number, scopeName: string) {
      const target = scopesContext[scopeIndex];
      if (target && Array.isArray(target.scopes)) {
        const namedScopeIndex = target.scopes.findIndex(
          (scope) => scope.scopeName === scopeName,
        );
        if (namedScopeIndex !== -1) {
          const variableIndex = target.scopes[
            namedScopeIndex
          ].variables.findIndex(
            (variable) => variable.variableName === variableName,
          );
          if (variableIndex !== -1) {
            target.scopes[namedScopeIndex].variables.splice(variableIndex, 1);
            return true;
          }
        }
      }
      return false;
    },
    clear() {
      scopesContext = [];
    },
  };
};
