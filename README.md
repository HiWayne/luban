# LuBan

鲁班，toC & toB 低代码平台

toC 一般是移动端用户使用的页面、toB 一般是企业内部后台，后面直接简称 toC、toB。

## 项目特点

1. 灵活可定制的 UI。比如我希望表格每行最后都有一列『操作』栏，里面有『修改配置』按钮。按钮会弹出修改配置的弹框，弹框里有一堆表单，用以修改表格该行配置。

2. 支持各组件自定义交互。比如我希望，点击 A 按钮后 -> B 表格消失、C 文字变成红色。

3. 优秀的运行时性能。低代码平台产出的内容是编译后的、浏览器可直接运行的代码，没有页面无关的运行时逻辑。

4. 页面支持人工二次修改。面对平台能力之外的需求，可以在平台生成的代码上人工修改（平台生成的代码拥有不错的可读性）。

5. 可创建页面模板。常用的类似页面可以保存成模板，提高工作效率。

## 包管理工具

`pnpm`

## Node Version

`>= 17.0.0`, 推荐 `17.6.0`

## 起步

```shell
nvm use 17.6.0

pnpm i
```

## 本地运行

```shell
# 前端服务，3000端口
npm run dev-frontend

# 后端服务，8000端口
npm run dev-backend
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

## 项目设计

前端代码在`/frontend/*`，主要负责后台页面

后端代码在`/backend/*`，主要负责将后台发送过来的页面配置编译成前端代码（浏览器可直接运行）

低代码搭建的页面中的最小粒度是 UI 模块，UI 模块有 type 属性，不同 type 代表不同的 UI 模块，用以呈现各种特定外观、功能、交互的 UI 。后端编译服务也是以 UI 模块为粒度实现的，每个 UI 模块都有一个与之对应的编译函数，新增模块随之增加编译函数即可。toC 页面的编译在`/backend/generateReactSourceCode/generateFrontstageCode/*`，toB 页面的编译在`/backend/generateReactSourceCode/generateBackstageCode/*`。

## 后台权限

权限配置在路由（`/src/router/routes/*`）中的 `permissions: string[]`

没有该字段视为不需要权限、空数组`[]`视为仅需登录、`['normal_manager'](举例)`需要普通管理员身份

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

## Test

```shell
npm run test
```

## FQ

1. `npm run dev` 后出现 `Vite Error, /node_modules/...... optimized info should be defined` 的错误怎么办？

可能是因为新安装了依赖，`node_modules/.vite` 里没有缓存，试试 `sh node_modules/.bin/vite --force`。具体原因详见 vite 的 [dep-pre-bundling](https://vitejs.dev/guide/dep-pre-bundling.html)。

2. 为什么 `.gitignore` 要忽略 `__snapshots__`？

因为不同机器 `styled-components` 生成的 className 哈希不同，导致单测的`toMatchSnapshot`误报
