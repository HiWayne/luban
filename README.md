# Low Code 低代码平台： luban(鲁班)

#### 由旧项目[shekina](https://github.com/HiWayne/shekina)重构而来

#### 感兴趣的话可以看[重构原因](https://github.com/HiWayne/shekina/blob/master/README.md)

## 名称由来

因为该平台并非『乐高』式的通过简单映射 component 堆砌页面，而是每个 component 之间可以自定义关联状态（即状态绑定），当一个组件发生修改，可以由用户定义它将影响哪些其他组件，其他组件因此做出相应的改变。它也可以自由定义后端接口模型，组件树和模型树是独立正交的，接口的设计不必耦合平台。这些树的节点和逻辑像『机关』一样关联在一起，可以自定义各种业务逻辑，这个平台和它的使用者就是『鲁班』。

## 平台亮点

`假设一个button按钮，它在一些情况下是点击按钮后发送请求，在另一个场景下是点击按钮后弹出弹框，点弹框中的确定按钮才发送请求。你在低代码平台会怎样设计这个按钮配置？给按钮的配置里加上action字段，不同的action对应不同的逻辑？那如果现在又有需求，点击按钮后某个组件消失呢，再加一个action吗？`

`想想问题的本质是什么。在前端代码中是怎么解决这件事的？状态。所有的页面逻辑都是基于状态，当我点击按钮，它触发了状态的改变，于是其他依赖这个状态的视图发生了变化，它可以是弹窗出现、可以是某个组件消失、可以是直接发送请求……`

`这就是这个平台的设计思想，不是为了解决这个问题而想方案，而是从更底层更抽象的角度解决『这类』问题。于是它带来了以下的特性：`

- 灵活性

  > 或许非互联网企业可能有很多类似问卷调查这样的简单后台，但在正常互联网企业中大部分的内部后台都是有不少自定义逻辑的，组件之间是有不少状态关系的，所以简单的『拼装』组件并不能给后台开发带来多少提效，因为没有多少后台只是简单几个表单再加一个按钮就完成了，平台必须能够满足丰富的业务逻辑。而能完成丰富逻辑，它就必须足够抽象、细粒度。

  > 假设这样一个场景，有两个 radio 标签，分别代表男、女。当选择男时下方只显示男性相关的选项，选择女时下方只显示女性相关的选项。用代码写不难，但浪费时间且枯燥无味，『乐高』式的平台又满足不了需求，这个平台则可以。这只是一个简单的案例，因为这个平台基于的模型足够抽象，你可以用状态(state)和修改状态(effect)的机制做非常多的事情。而市面上的很多低代码平台都是提供有限的配置，更多只关注组件本身，缺少组件之间的逻辑性。

  > 总的来说，它十分适合策略/状态模式的场景。在一些复杂逻辑的后台里，比如配置短信 push 推送的后台，你可能要针对不同类型的用户触发不同的 push 策略，那些定义策略的表单们又是由完全不同的，这时『乐高』式的平台就难以完成这种需求。

  > 另外还可以在基础组件之外，扩展更多自定义组件，以满足不同企业风格和特殊逻辑。

- 后端解耦
  > 它不提供后端接口，也不需要后端接口面向它实现。相反，它可以面向后端接口实现。表单组件可以一一映射成自定义的字段，字段的嵌套关系可以并不一定和组件树对应，非常灵活。于是可以在现有后端体系不变的情况下完成前端页面，这是一个完全面向前端的平台。

## 项目结构

采用了基于 lerna 的 monorepo 来管理项目，分出了 **core** 和 **creation** 两个包。

其中 **core** 是将配置文件解析成页面的核心，将它拆出来是因为，在仅需要通过配置展示页面的场景下，引入 **core** 就足够了，不必耦合生产配置的逻辑。

**creation** 负责生产配置文件，它是一个可视化配置页面的平台，通过拖拽组件和填写配置，能够轻易的生成后台页面，最终的产物是 json，即作为将来 **core** 的输入。

## 原理概述

内部建立了 3 颗树，分别是 **vdomTree**（组件树）、**modelTree**（后端模型树）、**stateTree**（视图状态树）

3 棵树节点并非一一对应的关系，这是因为组件的结构（比如表单组件），它们对应的字段未必就是后端需要的数据模型结构，所以需要一个独立的**modelTree**，它和**vdomTree**有正交的关系。至于**stateTree**，由于不同层级的组件之间可能存在状态关系，于是不必多说它也应该独立出来。

那么组件是如何找到和它关联的模型和状态的呢？**vdomTree**的节点中有 **state**、**model**、**effect** 三个字段，分别保存了在其他两颗树的路径。

最终把**vdomTree**作为入口交给渲染层时，每个节点被解析成对应组件，组件通过**state**找到它依赖的状态，如果是表单组件会通过**model**找到它绑定的模型字段，通过 effect 找到它发生变更时要影响的状态。于是，当一个表单组件发生 change 后，它会根据**model**路径更新**modelTree**（模型树），可能还会根据**effect**路径修改**stateTree**（状态树）。触发更新后，其他依赖该**state**路径的组件也做出相应更新，完成了组件之间的状态通信。

## core 代码设计与难点 Logs

> **1. `vdomTree` 如何遍历**：

深度优先遍历 `vdomTree`，对每个节点会有 `beginWork`（递）、`completeWork`（归）两个阶段（参考自 React 源码）。由于要把 json 转化为 `JSX.Element`，所以自底向上转换，在 `completeWork` 里处理。顺序是，叶子节点先被转换后，回溯到父节点，已经变成 `JSX.Element` 的子节点会放在父节点的 children 里，接着父节点继续转换并拿 children 作为它的子元素，当整个递归完成后，就形成了完整的 `JSX.Element` 结构用于渲染。

<br />
<br />

> **2. 组件标记**：

利用 `Reflect.defineProperty`，封装了 `definePropertyOfName`、`definePropertyOfLevel` 函数，通过它们给组件库中的组件标记唯一名称和组件级别（基础组件/进阶组件）。同时让相应的 getProperty 方法成对出现，约束了变量，避免出现散落在各处的 hard-coding。将来组件如果需要增加权限，组件标记也可以起到作用。

```ts
export const defineProperty = (
  target: FunctionComponent<any>,
  property: string,
  value: any,
  config?: PropertyDescriptor,
) => {
  config = config || {};
  Reflect.defineProperty(target, property, {
    value,
    enumerable: false,
    configurable: false,
    ...config,
  });
};

const createDefineProperty =
  <T>(property: string, config?: PropertyDescriptor) =>
  (target: FunctionComponent<any>, value: T) =>
    defineProperty(target, property, value, config);

const NAME = '_name';
export const definePropertyOfName = createDefineProperty<ComponentNames | ColumnNames>(NAME);
export const getNameProperty = createGetProperty(NAME);

const LEVEL = '_level';
export const definePropertyOfLevel = createDefineProperty<ComponentLevel[]>(LEVEL);
export const getLevelProperty = createGetProperty(LEVEL);
```

还可以看到函数被设计为类似`柯里化`和 `point free` 风格的编写方式，将原本多个参数的函数根据不同场景预执行，通过 `createDefineProperty` 这个函数工厂，避免了写模板代码。同时不显式提及参数的传递，符合函数式编程的`point free`特征。

<br />
<br />

> **3. 性能优化**：

`modelTree`、`stateTree` 以顶层状态的形式出现在 react 中，为了透传到各个组件所以使用了 `context`。与此同时，为了避免不必要的渲染，整个 `vdomTree` 产物使用 `useMemo` 缓存，只和 `vdomTree` 的变化有关（`vdomTree` 由平台配置后就已固定，不会变化，只有 `modelTree`、`stateTree` 会因为定义的逻辑而变化）

```tsx
const render = useMemo(() => <Render data={vdomTree} />, [vdomTree]);

return (
  <ModelTreeContext.Provider value={modelValue}>
    <StateTreeContext.Provider value={stateValue}>{render}</StateTreeContext.Provider>
  </ModelTreeContext.Provider>
);
```

于是当 `modelTree`、`stateTree` 变化时，只有 `render` 内部依赖（`useContext`）了它们的局部子组件们才会重新渲染。

<br />
<br />

> **4. immutable 的状态、模型如何局部更新**：

当一个表单 change 后会触发 `modelTree` 中的某个字段更新，当某个 `state` 更新时，会触发 `stateTree` 中对应字段的更新。由于数据需要 immutable，所以在一个大对象中局部更新显得有些复杂。推荐使用 `immerjs`，它是 `mbox` 作者写的 生产 immutable 数据的库，可以用 mutable 的方式产生 immutable 的数据，内部采用 `Proxy` 监听属性变化，相比于 `immutablejs` 库特有的数据结构和操作方式，`immerjs` 心智负担更小，也不需要掌握太多额外的知识。

<br />
<br />

> **5. 解析树的逻辑如何抽象**：

举例一个组件节点的配置：

```js
{
  level: 'advanced', // 进阶组件
  name: 'input', // 组件类型是input
  id: 15, // 唯一id
  label: '标题', // label文案
  width: '200px', // 宽度
  model: ['data', 'title'], // 模型字段路径：modelTree.data.title
  state: ['showInput'] // state路径：stateTree.showInput
  effect: ['hasInputValue'] // effect路径：会修改stateTree.hasInputValue
}
```

一个表单节点有些配置逻辑是相同的，比如`model`、`state`、`effect`这三个配置。

`model`表示表单 change 后对应 `modelTree` 路径下的值会被同步；
`state` 表示该组件的状态（比如可见性）受 `stateTree` 路径下的哪些属性影响；
`effect` 表示该组件会影响哪些 `state`（也是通过 `stateTree` 下的路径数组来表示）。

于是抽象出`useTree`这个 hooks，通过传入组件的`model`、`state`、`effect`配置，它会产生以上逻辑，并返回相应的方法或状态。其中`model`和`effect`涉及修改逻辑，主要实现方式是：直接根据 path 路径以 mutable 的形式修改对象，并传入 immerjs。`state`逻辑则是利用 reduce 遍历数组，期间不断判断当前是不是`Object`（即能不能再通过`.`读取属性），并返回最终的属性值或`null`。同时`state`、`effect`可能有多个值，所以还需要兼容二维数组的形式（值的 path 是一个数组，多个值是二维数组）。

<br />
<br />

> **6. 复杂配置解析的抽象**：

配置中有一些比较复杂的部分，比如『请求』、『翻页』相关的配置，因为一个请求的完整描述不仅要定义 `url`、`请求方式`、`参数来源`、参数可能经过的`规则校验函数`、`计算函数`等，还需要定义请求的数据最终会影响哪个`状态`。所以一个『请求』相关的配置可能是比较复杂的，比如：

```js
api: {
  url: '/api/query', // 请求地址
  method: 'get', // 请求方式
  effect: ['list'], // 请求最终影响哪些状态
  model: ['queryParams'], // 请求参数来自哪个model
  computeParams: `
    (params) =params && {...params, start: 0, limit: 25}
  `, // 参数的计算函数（可能需要类型转换等等逻辑）
  rules: `
    (params) ={
      if (params && (params.title || params.createTime)) {
        return true
      } else {
        return '标题和时间至少填写一个'
      }
    }
  `, // 参数的校验函数（如果return的不是true则是报错信息）
}
```

那么对 `api` 配置的解析自然也会比较复杂，同理像翻页 `pagination` 配置逻辑也会很复杂，于是将这些解析逻辑抽象成诸如 useApi、usePagination 的 hooks 用以在各种需要它们的地方复用。

<br />
<br />

> **7. json 如何保存函数**：

对于一些复杂配置，能写自定义函数是必须的，json scheme 中只能以字符串的形式保存函数。这些字符串在 runtime 被执行时，有两种方案。1. `eval`，2. `new Function`。最终选择了**方案 2**，因为 `eval` 会导致作用域中的变量都变成闭包，造成无谓的**内存浪费**，内部变量的暴露也会带来**安全风险**。而 `new Function` 的作用域只在全局作用域之上，只能通过约定的参数接收传给它有限的内容，不仅内存消耗少，而且安全性上也有一定提升。

<br />
<br />

> **8. 异步自定义函数带来的问题**：

如果自定义函数不会影响状态，那么异步和同步没什么区别。如果会影响状态，可能会产生过期状态(`stale state`)问题。为什么？首先修改状态是利用 `immerjs` 这个库，`produce` 接受一个`(draft) => { // modify draft }`函数，所以自定义函数只要负责`modify draft`那部分就可以，非常自然、方便。同时 `immerjs` 也支持函数返回 `promise`，可以异步的产生 immutable 数据。到目前为止似乎没什么问题，但是如果在异步期间，其他组件更新了状态，那么这个异步上下文中的状态就变成了`stale state`，异步的状态更新是在旧状态的基础上执行的，异步结束后就会用`stale state`更新`current state`从而发生状态不一致的问题。日常业务开发往往都是在异步结束后手动更新状态，此刻的状态本就是最新的，所以没有问题。但在这里，用户定义的只是这个更新流程的一部分，状态在同步执行期间就已经固定了，等异步结束可能早已变成旧的。问题的本质是，**状态切片在同步执行时就交给了`immerjs`，但是最终修改发生在异步里，期间视图状态如果被其他地方更新也无法感知，这个状态切片就落后了**。

如果改成在异步完成后才把状态交给 `immerjs` 然后同步修改，**这时的状态逻辑在同一个宏任务中，不会被其他状态更新『插队』，一定是最新的**。但是这样意味着 `immerjs` 需要放在在用户端，增加了自定义函数的代码量和知识边界，但不得不妥协。于是自定义函数改为接受两个参数，一个是封装后的 `immerjs` 的 `produce` ；另一个是 `next` 函数，它接受最终的新状态，用来在异步时通知状态更新，自定义函数也可以不用 `next` 直接返回一个 `promise` （见下方例子）。如果是同步的自定义函数可以不用调用`next`，直接返回新状态值。也可以依然调用`next`，因为 `useCustomClick` （自定义函数的处理封装在 `useCustomClick` 这个 hooks 中）内部有锁机制，如果 `next` 被调用过，则不会使用返回值，否则会判断返回值是否存在，然后主动调用`next`，最后把锁放开以便下一次使用。

下面是定义自定义函数的例子：

```ts
// 同步
(immer_produce, next) => {
  const newState = immer_produce((state) => {
    state.someState = true;
  });
  // 也可以不return，直接调用next
  // next(newState);
  return newState;
};

// 异步
(immer_produce, next) => {
  setTimeout(() => {
    const newState = immer_produce((state) => {
      state.someState = true;
    });
    next(newState);
  }, 3000);

  // 也可以不用上面那种写法，直接返回一个promise，resolve的值是最终的newState
  /**
    return new Promise((resolve) => {
      setTimeout(() => {
        const newState = immer_produce((state) => {
          state.someState = true;
        });
        resolve(newState);
      }, 3000);
    });
  **/

  // 总之解决异步时状态不同步的关键是，将异步放在之前，保证immer_produce是同步的
  // 这里只是方便阅读，实际定义是一个字符串，放在json的onClick字段中
};
```

> **9. 在一次点击查询按钮过程中组件如何互相影响：**

假设这样一个场景，有一个查询按钮，下方有展示查询结果的表格，表格的每行有编辑、删除按钮，表格下方有翻页。查询按钮、表格、表格编辑按钮、表格删除按钮、翻页，一共需要配置 5 个组件。这些组件应当这样互相影响：

1. 当点击查询按钮时，表格应该进入 loading 状态；
2. 点击翻页时，表格应该进入 loading 状态；
3. 编辑或删除某一行后，应该重新请求表格当前页；
4. 再次点击查询按钮时，应该重新查询表格第 1 页，翻页器也回到第 1 页。

通过简单分析，至少应该有 3 个状态来表示这些交互，分别是：loading、isInit、isRefresh。我们先想一个最简单的做法，给这些组件预设这 3 个状态属性，然后给它们绑定状态。比如按钮设置 `effectLoading` 属性，值为`[ tableLoading ]`，表示它会修改 `stateTree.tableLoading` 中的状态。表格设置 `stateLoading` 属性，值为`[ tableLoading ]`，表示 table 的 loading 依赖 `stateTree.tableLoading` 中的状态。但是这么做引入了更多配置的概念，让使用者的心智负担增加，而且这些状态都是和请求有关，理应收敛在一起，现在却分散在组件 json 顶层配置中。那么如何更好的解决？

如果把组件和状态想象成数据结构中的 `图` 会发现，5 个组件像 5 个节点，但都和某一个节点（state）有边。也就是说上述 5 个组件看似独立，其实都被一个东西关联在一起，那就是返回值最终影响的 state，查询、编辑、删除 button、翻页器会修改 state，表格会依赖这个 state。也就是说似乎有这样一个『定理』：只要组件们和同一个请求有关，它们就会必然指向同一个节点，即和同一个 state 产生关联。那么把信息放在这个 state 中，它们自然也能通过这个 state 分享信息。于是定义出如下结构：

```ts
const result: {
  response: Response;
  _loading: boolean;
  _refresh: boolean;
  _init: boolean;
  params: RequestParams;
};
```

通过 state 分享以上的信息，相关组件就可以通过这个信息知道，它想 refresh 还是 init 还是仅仅是直接翻页？如果是 refresh，上次的请求参数是什么？翻页器也可以通过这个信息知道自己该在哪一页。

## creation 代码设计与难点 Logs

> **1. 页面拖拽交互该如何设计：**

渲染核心是 `core`，那么实际拖拽影响的是交给 `core` 的 json schema。最佳体验肯定是组件被拖动到画布中，画布显示该组件，但会有一些问题。首先画布显示的是 `core` 渲染出来的生产环境页面，其中的组件并没有 `creation` 中需要的拖拽能力，也就不能通过拖动交换位置和做删除操作。其实这个可以通过在 `core` 增加 `development` 和 `production` 来区分在不同场景下的组件的能力来解决。但这样做除了极大增加 `core` 的复杂度之外，还有一个问题。有些组件是默认隐藏的，比如 `modal`。那么像这样的组件如何在 `creation` 的画布中交互？如果设计为在 `development` 环境默认出现，那么它在顶层，其下的组件都会被覆盖。所以这里有一个类似浏览器中的：`dom tree` 和 `layout tree` 有可能不一致的问题。我们在绘画页面时实际操作的应该是 dom tree，至于看到的 layout tree 只是最终的结果，不应该把操作放在其中。

于是设计为专门有一个树形图用来编辑`vdomTree`，可以通过画布看到最终结果，而不是直接在画布上编辑

> **2. 树的拖拽编辑：**

项目里已经有了`antd`，于是首先想到了`antd`中的`Tree`组件，但是外部视图拖进`Tree`组件是无法感知的，通过阅读`Tree`和`rc-tree`的源码发现，`rc-tree`state 中的`dropAllowed`是 `false` 时不会调用传入的`onDrop`，而非内部节点拖动时`dropAllowed`不会为 `true`，所以这个组件无法满足需求。经过调研发现，`@antv/g6`中的`TreeGraph`的`onDrop`可以被外部节点的拖动触发。只是`@antv/g6`自身没有实现内部节点的交互，需要自己实现。
