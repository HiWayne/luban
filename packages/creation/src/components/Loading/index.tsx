import { FunctionComponent } from 'react';

interface LoadingProps {
  position?: string;
}

const Loading: FunctionComponent<LoadingProps> = ({ position }) => {
  return (
    <div
      className={`${
        position ? position : 'fixed'
      } top-0 left-0 right-0 bottom-0 m-auto z-50 w-36rem h-36rem rounded-full border-t border-r border-b border-pink-400 animate-spin origin-center`}
    ></div>
  );
};

export default Loading;
