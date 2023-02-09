declare module '*.svg' {
  import { FunctionComponent, SVGProps } from 'react';

  export const ReactComponent: FunctionComponent<
    SVGProps<SVGSVGElement> & { title?: string }
  >;

  const svgUrl: string;

  export default svgUrl;
}
