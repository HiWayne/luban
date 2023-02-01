export const wrapReactMicroAppHooks = (code: string) => {
  return `
        ${code}

        /**
         * bootstrap 只会在微应用初始化的时候调用一次，下次微应用重新进入时会直接调用 mount 钩子，不会再重复触发 bootstrap。
         * 通常我们可以在这里做一些全局变量的初始化，比如不会在 unmount 阶段被销毁的应用级别的缓存等。
         */
        async function bootstrap() {
            console.log('react app bootstraped');
        }
        __exports.bootstrap = bootstrap;
        
        /**
         * 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
         */
        let root
        async function mount(props) {
            const setUpdateCount = props.setUpdateCount;
            root = createRoot(props.container ? props.container.querySelector('#root') : document.getElementById('root'));
            root.render(<App setUpdateCount={setUpdateCount} />);
        }
        __exports.mount = mount;
        
        /**
         * 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
         */
        async function unmount(props) {
            root.unmount()
        }
        __exports.unmount = unmount;
        
        /**
         * 可选生命周期钩子，仅使用 loadMicroApp 方式加载微应用时生效
         */
        async function update(props) {
          console.log('update props', props);
        }
        __exports.update = update;

        console.log(__exports)
    `;
};
