# LuBan

鲁班，toC & toB 低代码平台

toC 一般是移动端用户使用的页面、toB 一般是企业内部后台，后面直接简称 toC、toB。

## 项目特点

1. 灵活的 UI。比如我希望表格每行最后都有一列『操作』栏，里面有『修改配置』按钮。按钮会弹出修改配置的弹框，弹框里有一堆表单，用以修改表格该行配置。

2. 支持自定义组件之间的状态逻辑。比如我希望，点击 A 按钮后 -> B 表格消失、C 文字变成红色。

3. 较好的运行时性能。低代码平台产出的内容是编译后的、浏览器可直接运行的代码，没有额外的运行时逻辑。

4. 页面代码支持人工修改。面对超出平台能力的需求，可以在平台生成的代码基础上人工修改（平台生成的代码拥有不错的可读性）并发布。

5. 可复用的页面模板。类似的布局可以保存成模板快速创建页面，提高工作效率。

## 包管理工具

`pnpm`

```shell
npm i -g pnpm
```

## Node Version

`>= 17.0.0`, 推荐 `17.6.0`

## 依赖安装

```shell
nvm use 17.6.0

pnpm i
```

## 运行(需要同时启动两个服务)

```shell
# 前端服务，3000端口，用来启动配置后台
npm run dev-frontend

# 后端服务，8000端口，用来支持后台配置的编译
npm run dev-backend
```

## 开发指南

前端代码在`/frontend/*`，主要负责后台页面

后端代码在`/backend/*`，主要负责将后台发送过来的页面配置编译成前端代码（浏览器可直接运行）

低代码搭建的页面中的最小粒度是 UI 模块，UI 模块都有 type 属性，不同 type 代表不同的 UI 模块，用以呈现各种特定外观、功能、交互的 UI 。后端编译服务也是以 UI 模块为粒度实现的，每个 UI 模块都有一个与之对应的编译函数，负责将 nodeAST（一个表示 UI 和逻辑的 DSL 配置）编译成 react 组件代码。toC 页面的编译函数在`/backend/generateReactSourceCode/generateFrontstageCode/*`，toB 页面的编译函数在`/backend/generateReactSourceCode/generateBackstageCode/*`。

如需新增 UI 模块，在`/backend/generateReactSourceCode/generateFrontstageCode/*`或`/backend/generateReactSourceCode/generateBackstageCode/*`新增对应的编译函数即可（还需在同目录的 index.ts 的 switch case 中使用它）。

新增 UI 模块同时也需要新增对应的 props 类型，类型文件在`/backend/types/backstage/index.ts`和`/backend/types/frontstage/index.ts`里

### 下面将举例编译函数的各种写法及用处

假设没有配置任何 nodeAST 时编译结果是如下这样的

```jsx
// 空模块时

import { <StrictMode> } from 'react';
import { createRoot } from 'react-dom/client';

const App = () => {
  return <StrictMode></<StrictMode>
}

createRoot(document.getElementById('root')).render(<App />);
```

让我们看看编译函数不同的写法对编译结果有什么影响：

### 1. 编译写法一。希望创建组件声明函数。

```js
// generateCodeOfProp用来生成React中的 " prop=xxx" 代码(开头有空格)，自动根据不同类型的值生成合适的代码，如果值是undefined则返回空字符串
import { generateCodeOfProp } from '../generateCodeOfProp';
// createGenerateCodeFnReturn是用来生成generateCodeOfXxx系列函数返回值的工厂函数
import { createGenerateCodeFnReturn } from '../utils';

// 编译图片组件1
const generateCodeOfImage1 = (nodeAST) => {
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
const generateCodeOfImage2 = (nodeAST, id) => {
  const { props } = nodeAST;
  // 根据src等配置生成代码
  const { src } = props;

  const componentName = `Image_${id}`;
  const componentElement = `<${componentName}${generateCodeOfProp(
    'src',
    src,
  )} />`;

  return createGenerateCodeFnReturn({
    componentName,
    componentElement,
  });
};
```

假设 image 的 src 配置的是字符串"url"，这是编译结果：

```jsx
// 写法一的编译结果

import { <StrictMode> } from 'react';
import { createRoot } from 'react-dom/client';

const Image = ({src}) => (<img src={src} />);

const App = () => {
  return <StrictMode>
    <Image src="url" />
  </StrictMode>
};

createRoot(document.getElementById('root')).render(<App />);


// 简化版写法一的编译结果（假设id是1）
const Image_1 = ({children}) => (<img src="url" />);

const App = () => {
  return <StrictMode>
    <Image_1 />
  </StrictMode>
};

createRoot(document.getElementById('root')).render(<App />);
```

#### 编译写法一总结

写法一的特点是，组件会被声明并放在全局作用域

当返回`componentName`(组件名称)、`componentDeclaration`(组件声明)、`componentCall`(组件在 App 中的调用) 或者 返回 `componentName`、`componentElement`(组件声明中 return 后面的代码) 时，组件声明(componentDeclaration)会放在全局(如果只有 componentElement，它会被包装成一个函数像 componentDeclaration 一样放在全局)，这样代码复用性会比较好，编译体积会更小。全局声明会根据同名 `componentName` 去重，如果 image 模块被多处使用，`componentDeclaration` 代码也不会被声明多次。简化版写法只是将 App 中的 reactElement 调用封装到组件里，并不会使代码更少，只是提升了可读性、编译函数写起来更方便，简化版写法的缺点是不支持组件有状态逻辑。

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
// createGenerateCodeFnReturn是用来生成generateCodeOfXxx系列函数返回值的工厂函数
import { createGenerateCodeFnReturn } from '../utils';

// 编译a标签组件
const generateCodeOfA = (nodeAST) => {
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
import { <StrictMode> } from 'react';
import { createRoot } from 'react-dom/client';

const App = () => {
  return <StrictMode>
    <a href="url" target="_blank">跳转</a>
  </StrictMode>
};

createRoot(document.getElementById('root')).render(<App />);
```

#### 编译写法二总结

canHoist: false 代表不可以提升到全局声明，于是它只会在 App 里直接调用(调用 componentCall 或 componentElement 的代码)。相比写法一更适合简单组件的编译，可以不需要 componentName，因为没有声明，不需要根据 name 去重。缺点是不支持状态逻辑的编写，因为它连组件声明都没有。如果复杂组件使用这种方式编译，会造成代码冗余、可读性差的问题。

### 编译写法三。组件如何接收 children。

有些组件是有子组件的，比如 BlockContainer 这个块级容器，下面看看编译时怎么让父组件带上 children 的编译结果。

```js
// generateCodeOfProp用来生成React中的 "prop=xxx" 代码，自动根据不同类型的值生成合适的写法，如果值是undefined则返回空字符串
import { generateCodeOfProp } from '../generateCodeOfProp';
// createGenerateCodeFnReturn是用来生成generateCodeOfXxx系列函数返回值的工厂函数
import { createGenerateCodeFnReturn } from '../utils';

// 编译BlockContainer组件
const generateCodeOfBlockContainer = (nodeAST, children) => {
  // 因为是简单组件，所以用写法二，直接在App里调用reactElement就行
  const componentCall = `<div>${children}</div>`;

  return createGenerateCodeFnReturn({
    componentCall,
    canHoist: false,
  });
};
```

参数`children`就是 children nodeAST 节点编译出来的 reactElement 调用代码（`<xxx></xxx>`）

如果需要提升组件声明同时不想像写法一那样写太多也不需要状态逻辑，可以用写法一的简化版：

```js
// generateCodeOfProp用来生成React中的 "prop=xxx" 代码，自动根据不同类型的值生成合适的写法，如果值是undefined则返回空字符串
import { generateCodeOfProp } from '../generateCodeOfProp';
// createGenerateCodeFnReturn是用来生成generateCodeOfXxx系列函数返回值的工厂函数
import { createGenerateCodeFnReturn } from '../utils';

// 编译BlockContainer组件
const generateCodeOfBlockContainer = (nodeAST) => {
  const componentName = 'BlockContainer';
  const componentElement = `<div>{children}</div>`;

  return createGenerateCodeFnReturn({
    componentName,
    componentElement,
  });
};
```

`{children}`会自动被外部替换成 children nodeAST 节点编译出来的 reactElement 调用代码（`<xxx></xxx>`）

如果需要状态逻辑，那自然使用完全版的写法一就可以了，children 像 `const componentCall = '<div>${children}</div>';` 里面一样使用即可

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

上面的配置表示：有一个列表容器`List`，里面会根据 `component_scope_variable_list` 变量循环渲染 renderItem.render 里的 nodeAST，它是`Text`。循环函数的参数名是`iterate_scope_variable_item`。Text 的文本是一个变量，变量内容是`iterate_scope_variable_item.text`。下面我们来看看`List`该如何编译：

```js
// generateCodeOfProp用来生成React中的 "prop=xxx" 代码，自动根据不同类型的值生成合适的写法，如果值是undefined则返回空字符串
import { generateCodeOfProp } from '../generateCodeOfProp';
// createGenerateCodeFnReturn是用来生成generateCodeOfXxx系列函数返回值的工厂函数
import { createGenerateCodeFnReturn } from '../utils';
// 这个是将ast编译成react代码的函数(toc适用)，重点就是这个函数
import { astToReactNodeCodeOfFrontstage } from '../index';

// 编译List
const generateCodeOfList = (nodeAST, declarations, context) => {
  const { props } = nodeAST;
  const { data, renderItem } = props;

  // 因为只是介绍nodeAST如何渲染，所以我们简单使用写法二，直接在App调用，也就是componentCall或componentElement
  /** 因为children是nodeAST，所以需要astToReactNodeCodeOfFrontstage将它编译成代码
   * declarations, context参数你不知道不要慌，可以从外部(同目录下的index.ts)传进来的
   * 一定要记得.call，因为需要的是组件调用代码（<xxx></xxx>），所以取astToReactNodeCodeOfFrontstage的返回值里的call
   */
  const componentCall = `<div>
    {${data}.map((iterate_scope_variable_item) => (${
    astToReactNodeCodeOfFrontstage(children, declarations, context).call
  }))}
  </div>`;

  return createGenerateCodeFnReturn({
    componentCall,
    canHoist: false,
  });
};
```

最终 componentCall 的结果就是类似`<div>{component_scope_variable_list.map((iterate_scope_variable_item) => (<span>{iterate_scope_variable_item.text}</span>))}</div>`这样的了

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

## Git 操作规范

遵循 angular specification

```shell
git add .

# 交互式编写commit
git cz

git push
```

## 增删依赖

```shell
pnpm i dependence_name

# 开发环境依赖
pnpm i -D dependence_name

pnpm uninstall dependence_name
```

## Test

```shell
npm run test
```

## FQ

1. `npm run dev` 后出现 `Vite Error, /node_modules/...... optimized info should be defined` 的错误怎么办？

可能是因为新安装了依赖，`node_modules/.vite` 里没有缓存，试试 `sh node_modules/.bin/vite --force`。具体原因详见 vite 的 [dep-pre-bundling](https://vitejs.dev/guide/dep-pre-bundling.html)。

2. 为什么 `.gitignore` 要忽略 `__snapshots__`？

因为不同机器 `styled-components` 生成的 className 哈希不同，导致单测的`toMatchSnapshot`误报
