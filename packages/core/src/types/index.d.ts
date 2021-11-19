type Path = string[];

type MaybeHasSubPath = Path | Path[];

interface VDomNode {
  // 组件等级，基础型配置方便、灵活性差；进阶型配置复杂、灵活性高
  level: Level;
  id: string | number;
  // 组件类型，如 input button
  name: ComponentNames;
  // button input datepicker，antd不同的button风格 不同的input datepicker类型，
  type?: string;
  // 依赖的state路径（如state.content.title -> ['state', 'content', 'title']），可以依赖多个state，用二维数组表示
  state?: MaybeHasSubPath;
  // 关联的表单模型，类型同state
  model?: MaybeHasSubPath;
  // 发生修改后影响哪个state，类型同state
  effect?: MaybeHasSubPath;
  // button特有，在table中使用button时，table会把button所在这行的数据注入给button，将来点击按钮时能拿到相关数据，比如编辑、删除
  ioc?: any;
  // 子元素
  children?: VDomNode[];
  // 左偏移，以24栅格布局为基础，最终会转成px，所以支持小数
  leftOffset?: number;
  // 上偏移
  topOffset?: number;
  /* 计算函数的字符串形式，用于处理拿到的数据，例如对对象中的content属性去空格，"(data) => data && {...data, content: data.content.trim()}"
   * 一般在table、button中使用，table在拿到返回值后可能需要派生，button在拿到table注入内容时可能也需要派生
   */
  computeData?: string;
  // 计算函数的字符串形式，用于处理返回一个请求值，一般在button中使用
  computeParams?: string;
  // button特有，打开/关闭按钮，需要给状态设置true/false
  value?: boolean;
  // button特有，请求相关的配置
  api?: Api;
  // button按钮文案
  text?: string;
  // button跳转地址
  href?: string;
  // button特有，类似a标签的target
  target?: string;
  // button、input等表单的大小，参考antd
  size?: Size;
  // form的布局形式，如行内、块级，参考antd
  layout?: Layout;
  // input校验规则，参考antd
  rules?: any[];
  // basic input中的是否必填
  required: boolean;
  // input label的宽度
  labelWidth?: number;
  // input表单本身的左偏移
  wrapperOffset?: number;
  // input label文案
  label?: string;
  // input表单本身的宽度
  width?: number | string;
  // modal弹框的标题
  title?: string;
  // model弹框的内容
  content?: VDomNode[] | string;
  // model弹框的底部
  footer?: VDomNode[];
  // table的每列配置
  columns?: Column[];
  // table行的选中类型，单选/多选
  rowSelectionType?: RowSelectionType;
  // table翻页配置
  pagination?: Pagination;
  // datepicker范围精度
  picker?: string;
  // button请求完成后重新请求当前页列表
  refresh?: Api;
  // button请求完成后重新请求初始页列表
  init?: Api;
}

interface ModelTree {
  [key: string]: any;
}

interface StateTree {
  [key: string]: any;
}

interface CommonProps {
  level: Level;
  state?: MaybeHasSubPath;
  model?: MaybeHasSubPath;
  effect?: MaybeHasSubPath;
  ioc?: any;
  leftOffset?: number;
  topOffset?: number;
  computeData?: string;
  computeParams?: string;
}

interface ComponentHasName extends React.FunctionComponent {
  name?: string;
}

interface Pagination {
  limit: number = 10;
  computeStart?: string;
  computeMore?: string;
  computeTotal?: string;
  api?: Api;
}
