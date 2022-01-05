import { FunctionComponent, useMemo } from 'react';
import { traverse, getNameProperty } from '@core/utils/index';
import * as baseComponents from 'baseComponents/index';
import * as customComponents from 'customComponents/index';
import { ComponentsObject } from '@core/types/types';

const Components = {
  ...baseComponents,
  ...customComponents,
};

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
