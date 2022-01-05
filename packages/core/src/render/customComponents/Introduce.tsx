import { ComponentLevel, ComponentNames } from '@core/types/types';
import { definePropertyOfName, definePropertyOfAliasName, definePropertyOfLevel } from '@core/utils/index';

const Introduce = () => (
  <section>
    <h2>自定义组件开发说明（自定义组建定义在"/packages/core/src/render/customComponents"目录）</h2>
    <ul>
      <li>
        1. 组件定义
        <p>
          首先去/packages/core/src/types/types.ts中的"enum ComponentNames"增加新的组件类型
          <br />
          其次引入如下函数或变量
          <pre>
            {`
              import {
                definePropertyOfName,
                definePropertyOfAliasName,
                definePropertyOfLevel,
                definePropertyOfConfig,
              } from '@core/utils/index';
            `}
          </pre>
          并这样使用
          <pre>
            {`
              definePropertyOfName(CustomComponent, ComponentNames.CUSTOM); // 定义组件name（对应配置中的name）
              definedPropertyOfAliasName(CustomComponent, '自定义组件名'); // 定义组件显示的名称（前台名）
              definePropertyOfLevel(CustomComponent, [ComponentLevel.ADVANCED]); // 定义组件有哪些等级（BASIC基础, ADVANCED进阶）
              definePropertyOfConfig(CustomComponent, { [ComponentLevel.BASIC]: {}, [ComponentLevel.ADVANCED]: {} }) // 定义组件属性schema
            `}
          </pre>
        </p>
      </li>
      <li>
        2. 使用通用配置解析
        <p>
          api配置可以使用useApi hooks解析，返回请求函数。详情见"/packages/core/src/shared/hooks/useApi.ts"注释
          <br />
          model、state、effect配置可以使用useTree
          hooks解析，返回一个对象。详情见"/packages/core/src/shared/hooks/useTree.ts"注释
          <br />
          pagination配置可以使用usePagination
          hooks解析，返回一个对象。详情见"/packages/core/src/shared/hooks/usePagination.ts"注释
          <br />
          customLogic配置可以使用useCustomLogic
          hooks解析，传入自定义函数字符串，返回一个可能修改状态的函数。hooks定义在"/packages/core/src/shared/hooks/useCustomLogic.ts"
          <br />
          <br />
          更具体的使用可以参考"/packages/core/src/render/baseComponents"中的组件
        </p>
      </li>
    </ul>
  </section>
);

definePropertyOfName(Introduce, ComponentNames.INTRODUCE);
definePropertyOfAliasName(Introduce, '自定义组件开发说明');
definePropertyOfLevel(Introduce, [ComponentLevel.BASIC]);

export default Introduce;
