/**
 * @description 生成generateCodeOfXxx系列函数的返回值
 * @param canHoist 编译时是否提升声明，默认true
 * 假设有一个A组件（内容是div）渲染两次
 * 不提升声明的编译结果:
 * <div></div>
 * <div></div>
 * 提升声明的编译结果:
 * const A = () => (<div></div>)
 * <A />
 * <A />
 * 提升声明有利于可读性和代码复用，声明统一提升到顶级组件(App)的作用域中
 * const App = () => {
 *  const A = () => (<div></div>)
 *
 *  return <>
 *    <A />
 *    <A />
 *  </>
 * }
 * React.render(<App />)
 *
 * 组件使用了非顶级组件的变量时，提升声明处理起来会很麻烦，例如下例中的img组件: ['url1', 'url2'].map((url) => <img src={url} />)，如果提升声明到顶级组件将无法使用函数作用域里的url变量，这时可以关闭声明提升
 * TODO: 其实技术上也能做到 const Image = ({ src }) => (<img src={src} />); ['url1', 'url2'].map((url) => <Image src={url} />)，但是比较麻烦。
 *
 * @param componentName 组件名称
 * @param componentElement canHoist=false时可选 组件element代码，"<div></div>"
 * @param componentDeclaration 可选 组件声明代码，"const Xxx = () => {...};"
 * @param componentCall 可选 canHoist=false时必选 组件调用代码，"<Name prop={xxx} />"
 * @returns {canHoist: boolean; componentName: string; componentDeclaration: string; componentElement: string; componentCall: string} { canHoist: 是否可以提升声明boolean; componentName: 组件名称string; componentDeclaration: 组件声明代码 const Xxx = () => {...}; componentElement: 组件element <div></div>; componentCall: 组件调用代码 }
 */
export const createGenerateCodeFnReturn = (params: {
  canHoist?: boolean;
  componentName?: string;
  componentElement?: string;
  componentDeclaration?: string;
  componentCall?: string;
}) => {
  const {
    canHoist = true,
    componentName = '',
    componentElement,
    componentDeclaration,
    componentCall,
  } = params;

  if (
    (canHoist &&
      ((componentDeclaration && componentCall) ||
        typeof componentElement === 'string') &&
      typeof componentName === 'string') ||
    (!canHoist &&
      (typeof componentElement === 'string' ||
        typeof componentCall === 'string'))
  ) {
    return {
      canHoist,
      componentDeclaration:
        componentDeclaration ||
        (canHoist
          ? `const ${componentName} = ({ children }) => (${componentElement});`
          : ''),
      componentName,
      componentElement: componentElement || '',
      componentCall: componentCall || '',
    };
  } else {
    throw new Error(
      `createGenerateCodeFnReturn只接受以下3种模式：1. canHoist: true, componentElement: string，可以提升并且有组件元素；2. canHoist: true, componentDeclaration: string, componentCall: string，可以提升并且有组件声明和组件调用；3. canHoist: false, componentElement?: string, componentCall?: string，不可以提升并且有组件元素或组件调用 `,
    );
  }
};
