# 低代码平台 LuBan 鲁班

## （暂停开发中……）

能工巧匠-鲁班。可支持 toC、toB 页面的可视化搭建，无需编写代码、可以自定义 UI 和交互逻辑。

## 项目特点

1. 灵活的 UI。可以自由组合组件、定制组件，在 toc 模式甚至可以通过细粒度组件实现几乎各种 UI。比如在 tob 里可以自定义表格每列单元格的内容、弹窗里的内容，在 toc 里可以从 div 层面开始绘制 UI。

2. 支持组件之间的自定义状态逻辑。比如我希望：点击按钮 -> 发出请求 -> compute 请求数据 -> 卡片里展示 computed 后的数据。或者希望表单修改后其他地方的内容也跟着变化等等。

3. 页面秒上线。可以自定义页面的 url 路径，点击发布后用户立即可访问。跳过传统开发的配置路由、打包构建、部署等过程。极大加快了新业务上线、修复 bug 的速度。

4. 页面代码支持人工修改。面对超出平台能力的需求，可以在平台生成的源码(react)基础上人工修改然后发布，平台生成的代码拥有较好的可读性。

5. 模板系统。你搭建好的页面可保存成模板。他人可复用你的模板快速搭建页面，并在其基础上继续修改。你还可以邀请别人一起维护模板。

6. 编译型平台、有较好的运行时性能。低代码平台产出的页面，仅包含编译后的业务相关的代码，没有额外的运行时逻辑。

## 技术栈

### 版本管理工具

使用`nvm`管理 node 版本、使用`pnpm`替代 npm

```shell
# mac安装nvm方法，其他设备自行查找
brew install nvm

nvm install 17.6.0

nvm use 17.6.0

npm i -g pnpm
```

### 前端

react18、styled-component、zustand、typescript

### 后端

fastify、nodejs、typescript

### 数据库

redis、mongo

## 项目运行

### Node Version

`>= 17.0.0`, 推荐 `17.6.0`

### 依赖安装

```shell
nvm use 17.6.0

pnpm i
```

### 规范工具安装

用于 commit 前代码检查、规范 git commit 格式

全局安装过 pnpm、commitizen 的，前两步不需要

```shell
npm i -g pnpm commitizen && commitizen init cz-conventional-changelog --force --save --save-exact && npm run husky-prepare
```

### 运行

1. 需要 mongo 服务

2. 需要 redis 服务

mongo、redis 相关配置在/src/backend/config/db.config.ts 里

3. 需要同时启动前后端两个 web 服务

```shell
# 前端服务，3000端口，用来访问配置后台页面
npm run dev-frontend

# 后端服务，8000端口，用来支持编译、登录等服务
npm run dev-backend
```

4. 浏览器打开 http://localhost:3000

### 部署

在项目 `/src/backend/config/host.config.ts` 里可以配置低代码平台产出页面的`页面域名`、`public path`（开头有/末尾无/）、`cdn域名`。

在项目 `/src/backend/config/server.config.ts` 里可以配置后端服务的端口。

```
npm run build

npm run zip
```

`npm run build`编译打包前后端代码

`npm run zip`会将相关内容打包成`dist.zip`，然后你需要做的是：

假设你在服务器使用 `luban` 文件夹存放 dist.zip

1. 将 dist.zip 发送到服务器的`luban`文件夹下并解压，这时 `luban` 下会多出 `dist` 文件夹。服务器需要有 node (推荐 17.6.0) 环境和`pnpm`，在 `dist` 文件夹下执行`pnpm i`、`npm run start`，以启动后端服务。

2. 外网如何访问：外部（例如 nginx）访问平台前端去`dist`文件夹中的 `dist-frontend` 目录、外部访问平台后端去服务器的 `8000` 端口、外部访问平台产出的页面去 `luban` 文件夹下的 `pages` 目录

### Test

一般不需要手动执行，会在 commit 前自动测试

```shell
npm run test
```

## 配置后台页面权限

权限配置在路由（`/src/frontend/router/routes/*`）中的 `permissions: string[]`

没有该字段视为不需要权限、空数组`[]`视为仅需登录、`['normal_manager']`(仅举例，具体值看业务)代表需要普通管理员身份

举例：

```ts
const editorRoutes: RouteType[] = [
  {
    path: '/editor',
    element: LazyEditor,
    permissions: [], // 需要登录
    // permissions: ['normal_manager'] 需要普通管理员身份
    // permissions: undefined 不需要任何权限
  },
];
```

## FQ

1. 该低代码平台前后端的原理是什么，开发遇到的问题有哪些？

生成的页面是由配置产生的。配置的核心部分是 view 字段，它是由 nodeAST（一个最小粒度的、能表示 UI 与逻辑的抽象语法节点）嵌套组成的树，nodeAST 树会交给编译核心，每个 nodeAST 会在经过与其 type 对应的编译插件产出 react 代码。整个树从 root 节点开始，被递归编译成完整的 react 应用代码，编译过程中还有一些优化细节（如组件复用等）。由于生成的只是 react 源码（这部分美化后可以用于代码预览、人工二次编辑），所以还需要编译、构建、压缩成浏览器可执行的代码。由于后端的最终产物是个完整的应用(SPA: html+js)，所以低代码平台页面通过前端微服务的方式整合到主应用里用于可视化编辑的实时预览。低代码平台可视化编辑时，需要有拖拽调换位置、点击 UI 展示对应配置等交互，然而最终产物(html)已经与原始的 nodeAST 失去了关联。为了解决这一点，在编辑模式时，低代码平台页面每次添加 UI 时都会生成一个唯一 id（也就是 nodeAST 里的 id），后端编译插件会给 nodeAST 对应组件代码的最外层的 html 元素加上这个 id。低代码平台配置页本地也通过 id 存储了相关数据，于是低代码平台配置页面可以通过这个 html id 知道当前选中的是什么组件、什么 nodeAST，以及它的当前配置，从而可以进行可视化编辑交互。

2. 如果平台已有组件不能满足需求怎么办？每个组件，在前端编辑器里可能都需要一套独特的配置面板，维护起来会不会很麻烦？

如果平台已有的 UI 组件不能满足需求需要新增，编译系统在设计时抽象出了【编译插件】这个概念，编译核心与编译插件解耦，只需要新写一个编译插件即可满足新的需求。至于前端编辑器里的配置面板，新的 UI 组件确实可能带来一套完全不同的配置表单，但不需要额外新写。编辑器的渲染核心也已经为需求变化做了解耦，只需给编译插件定义 meta（元数据），即可自动在前端生成新的配置面板。（插件的写法以及 meta 的定义将会在下面的【开发文档】中介绍）

3. `npm run dev` 后出现 `Vite Error, /node_modules/...... optimized info should be defined` 的错误怎么办？

可能是因为新安装了依赖，`node_modules/.vite` 里没有缓存，试试 `sh node_modules/.bin/vite --force`。具体原因详见 vite 的 [dep-pre-bundling](https://vitejs.dev/guide/dep-pre-bundling.html)。

4. 为什么 `.gitignore` 要忽略 `__snapshots__`？

因为不同机器 `styled-components` 生成的 className 哈希不同，导致单测的`toMatchSnapshot`误报

## 开发指南

前端代码在`/src/frontend/*`，主要负责后台页面

后端代码在`/src/backend/*`，主要负责编译（将后台发送过来的页面配置编译成前端代码（浏览器可直接运行的 html、js））、用户系统、模板系统、发布系统、权限系统

低代码搭建的页面中的最小粒度是 UI 模块（在配置中可以看作一个节点(node)），UI 模块都有 type 属性，不同 type 代表不同的 UI 模块，用以呈现各种特定外观、功能、交互的 UI 。后端编译服务也是以 UI 模块为粒度实现的，每个 UI 模块都有一个与之对应的编译插件，负责将 nodeAST（**一个表示 UI 和逻辑的 AST(抽象语法树)**）编译成 react 组件代码，编译核心只是负责将不同的 nodeAST 交给对应的插件编译。toC 页面的编译插件在`/backend/generateReactSourceCode/generateFrontstageCodePlugins/*`，toB 页面的编译函数在`/backend/generateReactSourceCode/generateBackstageCodePlugins/*`。

如需新增 UI 模块(组件)，在`/backend/generateReactSourceCode/generateFrontstageCodePlugins/*`或`/backend/generateReactSourceCode/generateBackstageCodePlugins/*`中新增对应的编译插件即可（还需在同目录的 index.ts 中新增 switch case），从而实现了编译核心逻辑和新增插件的解耦。

UI 模块的类型文件在`/backend/types/backstage/index.ts`和`/backend/types/frontstage/index.ts`里

### 如何编写编译插件？

假设没有配置任何 nodeAST 时编译结果是如下这样的

```jsx
// 空模块时

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const App = () => {
  return <StrictMode></<StrictMode>
}

createRoot(document.getElementById('root')).render(<App />);
```

让我们看看编译插件不同的写法对编译结果有什么影响：

### 0. 必须写法（主要和编辑环境下的特殊处理相关）。

```js
/**
 * 每个编译插件至少需要接受这三个参数（参数来自同目录下的index.ts，即编译核心）
 * nodeAST-该UI节点的ast、id-唯一id、context-上下文信息，里面有用的是development-是否是开发(编辑)环境
 */
const generateCodeOfXxxPlugin = (nodeAST, id, context) => {
  // 必须一：
  /**
   * context的作用除了给 astToReactNodeCodeOfFrontstage 提供参数（这个后面会讲到），另一个必须的作用是：
   * 开发环境或者叫编辑环境，是低代码后台编辑页面时所在的环境
   * 这种环境下，UI本身应该不能交互，否则会和低代码后台的交互（比如拖拽、点击）冲突
   * 所以需要根据context.development决定是否不编译交互相关的代码
   * 例子可以看 /src/backend/generateReactSourceCode/generateFrontstageCode/generateCodeOfBasicContainerPlugin.ts 里的onClickCode
   */
  // 必须二：
  /**
   * id的作用除了封装组件时生成唯一name（这个后面会讲到），另一个必须的作用是：
   * 低代码后台在配置页面时，可以通过点击某个页面UI，唤起它的配置面板，或者可以拖拽某个UI和其他调换位置等操作
   * 但是低代码后台是不知道预览页面里的UI和组件模块的对应关系的
   * 所以需要编译时，在development环境下，给组件的最外层元素加上特殊的id，用来标记这是一个组件模块。如果id=1，那就是<div id="luban_1"></div>
   * 例子可以看 /src/backend/generateReactSourceCode/generateFrontstageCode/generateCodeOfBasicContainerPlugin.ts 里的createIdAttrInDev，它帮你封装好了根据context.development是否添加id属性的逻辑
   */
};
```

> 总结一下必须的写法：1. 如果 UI 模块有交互事件，必须根据 context.development 确定是否不能交互。2. 如果在 development 环境下，最外层元素需要有特殊的 id 属性

> 下面会讲各种不同的编译写法以及用处，它们可能为了讲述重点，所以省略了一些上述的必须写法，真正开发的时候不要忘记。

### 1. 编译写法一。当你希望创建组件声明函数。

```js
// generateCodeOfProp用来生成React中的 " prop=xxx" 代码(开头有空格)，自动根据不同类型的值生成合适的代码，如果值是undefined则返回空字符串
import { generateCodeOfProp } from '../generateCodeOfProp';
// createGenerateCodeFnReturn是用来生成generateCodeOfXxxPlugin系列插件返回值的工厂函数
import { createGenerateCodeFnReturn } from '../utils';

// 编译图片组件1
const generateCodeOfImage1Plugin = (nodeAST, id, context) => {
  const { props } = nodeAST;
  // 根据src等配置生成代码
  const { src } = props;

  const componentName = 'Image';
  const componentDeclaration = `const ${componentName} = ({src}) => (<img src={src} />);`;
  const componentCall = `<${componentName}${generateCodeOfProp('src', src)} />`;

  return createGenerateCodeFnReturn({
    componentName,
    componentDeclaration,
    componentCall,
  });
};

// 或者还有一种简化写法
// 编译图片组件2
// id是外部给的，保证唯一
const generateCodeOfImage2Plugin = (nodeAST, id, context) => {
  const { props } = nodeAST;
  // 根据src等配置生成代码
  const { src } = props;

  const componentName = `Image_${id}`;
  const componentElement = `<img${generateCodeOfProp('src', src)} />`;

  return createGenerateCodeFnReturn({
    componentName,
    componentElement,
  });
};
```

假设 image 的 src 配置的是字符串"url"，这是编译结果：

```jsx
// 写法一的编译结果

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const Image = ({ src }) => <img src={src} />;

const App = () => {
  return (
    <StrictMode>
      <Image src="url" />
    </StrictMode>
  );
};

createRoot(document.getElementById('root')).render(<App />);

// 简化版写法一的编译结果（假设id是1）
const Image_1 = ({ children }) => <img src="url" />;

const App = () => {
  return (
    <StrictMode>
      <Image_1 />
    </StrictMode>
  );
};

createRoot(document.getElementById('root')).render(<App />);
```

#### 编译写法一总结

写法一的特点是，组件会被声明并放在全局作用域

当返回`componentName`(组件名称)、`componentDeclaration`(组件声明)、`componentCall`(组件在 App 中的调用) 或者 返回 `componentName`、`componentElement`(组件声明中 return 后面的代码) 时，组件声明(componentDeclaration)会放在全局(如果只有 componentElement，它会被包装成一个函数像 componentDeclaration 一样放在全局)，这样代码复用性会比较好，编译体积会更小。全局声明会根据同名 `componentName` 去重，如果 image 模块被多处使用，`componentDeclaration` 代码也不会被声明多次。简化版写法只是将 App 中的 reactElement 调用封装到组件里，并不会使代码更少，只是提升了可读性、编译插件写起来更方便，简化版写法的缺点是不支持组件有状态逻辑。

其实比较简单的组件并不需要写法一，因为：

```jsx
// a
const Image = ({src}) => <img src={src} />
// in App
<Image src="url" />

// b
// in App
<img src="url" />
```

简单组件（比如上面这种仅一层 img）像 a 这样写反而很多余，还不如像 b 一样直接在 App 里<img />调用。

像`<div><div><span></span></div></div>`这种多层嵌套的，或者内部有状态逻辑的，才适合封装成组件提取到全局。

下面介绍怎么编译出像 b 一样直接调用的代码

### 2. 编译写法二。不封装成组件，直接在 App 里调用 reactElement。

```js
// generateCodeOfProp用来生成React中的 "prop=xxx" 代码，自动根据不同类型的值生成合适的写法，如果值是undefined则返回空字符串
import { generateCodeOfProp } from '../generateCodeOfProp';
// createGenerateCodeFnReturn是用来生成generateCodeOfXxxPlugin系列插件返回值的工厂函数
import { createGenerateCodeFnReturn } from '../utils';

// 编译a标签组件
const generateCodeOfAPlugin = (nodeAST, id, context) => {
  const { props } = nodeAST;
  // 根据href等配置生成代码，text是a标签的文本
  const { href, target, text } = props;

  // 叫componentElement也可以
  const componentCall = `<a${generateCodeOfProp(
    'href',
    href,
  )}${generateCodeOfProp('target', target)}>${text || ''}</a>`;

  return createGenerateCodeFnReturn({
    // 给componentElement属性也可以
    componentCall,
    canHoist: false,
  });
};
```

假设 href: "url", target: "\_blank", text: "跳转"，编译结果如下：

```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const App = () => {
  return (
    <StrictMode>
      <a href="url" target="_blank">
        跳转
      </a>
    </StrictMode>
  );
};

createRoot(document.getElementById('root')).render(<App />);
```

#### 编译写法二总结

canHoist: false 代表不可以提升到全局声明，于是它只会在 App 里直接调用(直接使用 componentCall 或 componentElement 的代码)。相比写法一更适合简单组件的编译，可以不需要 componentName，因为没有声明，不需要根据 name 去重。缺点是不支持状态逻辑的编写，因为它连组件声明都没有。如果复杂组件使用这种方式编译，会造成代码冗余、可读性差的问题，建议用写法一。

### 编译写法三。组件如何接收 children。

有些组件是有子组件的，比如 BasicContainer 这个容器，只是负责包裹子组件，必须有 children 负责实际展示 UI。下面看看编译时怎么让父组件接收 children。

```js
// generateCodeOfProp用来生成React中的 "prop=xxx" 代码，自动根据不同类型的值生成合适的写法，如果值是undefined则返回空字符串
import { generateCodeOfProp } from '../generateCodeOfProp';
// createGenerateCodeFnReturn是用来生成generateCodeOfXxxPlugin系列插件返回值的工厂函数
import { createGenerateCodeFnReturn } from '../utils';

// 编译BasicContainer组件
const generateCodeOfBasicContainerPlugin = (nodeAST, id, children, context) => {
  // 因为是简单组件，所以用写法二，将来直接在App里调用reactElement就行（<xxx></xxx>）
  const componentCall = `<div>${children}</div>`;

  return createGenerateCodeFnReturn({
    componentCall,
    canHoist: false,
  });
};
```

上面的参数`children`就是由 children nodeAST 节点编译出来的 reactElement 调用代码（`<xxx></xxx>`）。对 nodeAST 树的遍历是深度优先的，所以编译结束的顺序是自底向上，在父组件编译开始时就可以拿到 children 的结果。

如果需要提升组件声明同时不想像写法一那样太繁琐也不需要状态逻辑，可以用写法一的简化版：

```js
// generateCodeOfProp用来生成React中的 "prop=xxx" 代码，自动根据不同类型的值生成合适的写法，如果值是undefined则返回空字符串
import { generateCodeOfProp } from '../generateCodeOfProp';
// createGenerateCodeFnReturn是用来生成generateCodeOfXxxPlugin系列插件返回值的工厂函数
import { createGenerateCodeFnReturn } from '../utils';

// 编译BasicContainer组件
const generateCodeOfBasicContainerPlugin = (nodeAST, id, context) => {
  const componentName = 'BasicContainer';
  const componentElement = `<div>{children}</div>`;

  return createGenerateCodeFnReturn({
    componentName,
    componentElement,
  });
};
```

`componentElement`的值会被自动封装成`const BasicContainer = ({children}) => (<div>{children}</div>)`函数声明，相当于自动帮你写好了`componentDeclaration`。

如果你不想有组件声明，加上`canHoist: false`, `{children}`会自动被外部替换成 children nodeAST 节点编译出来的 reactElement 调用代码（`<xxx></xxx>`），直接在 App 里调用。

如果需要状态逻辑，那自然使用完全版的写法一就可以了，children 像 `const componentCall = '<div>${children}</div>';` 里面一样使用即可。

### 编译写法四。如果某个 prop 也是 nodeAST 怎么办。

假设有这样的较复杂低代码配置

```js
{
  id: 1,
  type: 'List',
  props: {
    data: 'component_scope_variable_list'
    renderItem: {
      iterate_scope_variable: 'item',
      render: {
        id: 2,
        type: 'Text',
        props: {
          text: 'iterate_scope_variable_item.text'
        }
    }
    }
  }
}
```

上面的配置表示：root nodeAST 是一个列表容器`List`，里面会根据 `component_scope_variable_list` 变量循环渲染 renderItem.render 里的 nodeAST，它是`Text`。循环函数的参数名是`iterate_scope_variable_item`。Text 的文本取自一个变量，变量内容是`iterate_scope_variable_item.text`。下面我们来看看`List`该如何编译：

```js
// generateCodeOfProp用来生成React中的 "prop=xxx" 代码，自动根据不同类型的值生成合适的写法，如果值是undefined则返回空字符串
import { generateCodeOfProp } from '../generateCodeOfProp';
// createGenerateCodeFnReturn是用来生成generateCodeOfXxxPlugin系列插件返回值的工厂函数
import { createGenerateCodeFnReturn } from '../utils';
// 这个是将ast编译成react代码的函数(toc的)
import { astToReactNodeCodeOfFrontstage } from '../index';

// 编译List
const generateCodeOfListPlugin = (nodeAST, id, declarations, context) => {
  const { props } = nodeAST;
  const { data, renderItem } = props;

  // 因为只是介绍nodeAST如何渲染，所以我们简单一点，使用写法二，直接在App调用，也就是componentCall或componentElement
  /** 因为children是nodeAST，所以需要astToReactNodeCodeOfFrontstage将它编译成react代码
   * declarations, context参数不知道是什么也不要慌，它们是从外部(同目录下的index.ts)传进来的
   * 一定要记得用.call，因为需要的是组件调用代码（<xxx></xxx>），所以取astToReactNodeCodeOfFrontstage的返回值里的call属性
   */
  const componentCall = `<div>
    {${data}.map((iterate_scope_variable_item) => (${
    astToReactNodeCodeOfFrontstage(renderItem.render, declarations, context)
      .call
  }))}
  </div>`;

  return createGenerateCodeFnReturn({
    componentCall,
    canHoist: false,
  });
};
```

最终 componentCall 的结果就是类似`<div>{component_scope_variable_list.map((iterate_scope_variable_item) => (<span>{iterate_scope_variable_item.text}</span>))}</div>`这样的了

### 编译插件和前端编辑器配置面板如何关联起来

我们新写的编译插件，是需要前端有对应的配置的，总不能每次新写一个 UI，都去前端写一个新的表单配置，需要有一个解耦的方式，让前端不关心这个 UI 该如何配置。写完插件，前端编辑器自动就有了相关的配置。

假设你写了一个叫 `generateCodeOfWaterfallPlugin` 的编译插件

```ts
const generateCodeOfWaterfallPlugin = () => {
  // ...
};

// 你需要给插件一个meta（元数据）属性，用来描述这个组件配置的UI
generateCodeOfWaterfallPlugin.meta: Meta = {
  // ...
};

interface Meta {
  // 组件等级，1-基础组件、2-复合组件
  level: 1 | 2;
  // 组件在面板里的顺序
  sort: number;
  // 是否还能有子组件
  leaf?: boolean;
  // 组件渲染出的html元素是否是空标签（不能有子元素，如img、hr）
  emptyTag?: boolean;
  // 组件名称
  name: string;
  type:
    | 'BasicContainer'
    | 'FlexContainer'
    | 'GridContainer'
    | 'ScrollList'
    | 'Image'
    | 'Text'
    | 'Paragraph';
  // 组件说明，用来解释这个组件的作用
  description: string;
  // 使用这个组件时，初始的NodeAST是什么
  defaultAST: Omit<NodeAST, 'id' | 'parent'>;
  // 组件对应的配置面板该如何在前端渲染，一个Config代表一行配置
  configs: Config[];
}

interface Config {
  // 该行配置名称
  name: string;
  // 该行配置的说明，解释这个配置的作用
  description: string;
  // 配置表单的UI描述
  formSchema?: FormSchema;
  // 当表单很复杂时，支持使用自定义组件
  FormComponent?: FC;
  // 配置是否必须
  required: boolean;
  // 配置被修改时对应修改NodeAST的prop字段名
  propName: string;
  // 默认配置值
  defaultConfig?: any;
}

// 配置表单的UI描述
interface FormSchema {
  // 表单类型（其中有很多自定义表单，如果你的需求超出已有的，可以继续新增）
  type:
    | 'input'
    | 'textarea'
    | 'radio'
    | 'checkbox'
    | 'select'
    | 'switch'
    | 'image-upload'
    | 'color-picker'
    | 'css-length'
    | 'variable-select'
    | 'css-margin'
    | 'css-padding'
    | 'css-border-radius'
    | 'custom-style'
    | 'image-src'
    | 'text-content'
    | 'bg-size'
    | 'action';
  // 如果是select、checkbox之类的表单，需要自定义options选项
  options?: { label: string; value: any }[];
  placeholder?: string;
  // 直接传给表单组件的props
  props?: Record<string, any>;
}
```

具体代码可以参考已经写好的插件。

### 总结

其实只要明确了`componentName`、`componentDeclaration`、`componentCall`、`componentElement`、`meta`的含义，写几个例子实验一下结果，同时想清楚`编译`和`运行时`代码的区别，那么面对新模块开发起来就基本没什么问题了。

### 增删依赖

```shell
# 安装生产环境依赖
pnpm i dependence_name

# 安装开发环境依赖
pnpm i -D dependence_name

# 删除依赖
pnpm uninstall dependence_name
```

### Git Commit 规范

自动化遵循 angular specification

```shell
git add .

# 交互式编写commit
git cz

git push
```
