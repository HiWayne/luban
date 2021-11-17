import { FunctionComponent, useMemo } from 'react';
import { traverse, getNameProperty } from 'utils/index';
import * as Components from 'baseComponents/index';
import { ComponentsObject } from 'types/types';

interface RenderProps {
  data: VDomNode | VDomNode[];
}

const Render: FunctionComponent<RenderProps> = ({ data }) => {
  const renderedReactElement = useMemo(() => {
    return traverse(data, undefined, (vdomTreeNode): any => {
      const [MatchedComponent] =
        Object.values(Components as ComponentsObject).filter((value) => getNameProperty(value) === vdomTreeNode.name) ||
        [];
      if (typeof MatchedComponent !== 'undefined') {
        const { children, id, ...validProps } = vdomTreeNode || {};
        if (vdomTreeNode && Array.isArray(children) && children.length > 0) {
          // @ts-ignore
          return (
            <MatchedComponent key={id} {...validProps}>
              {children}
            </MatchedComponent>
          );
        } else {
          // @ts-ignore
          return <MatchedComponent key={id} {...validProps} />;
        }
      }
    });
  }, [data]);
  return <>{renderedReactElement}</>;
};

export default Render;
