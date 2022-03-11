import { FunctionComponent, useMemo } from 'react';
import { traverse, getNameProperty } from '@core/utils/index';
import * as baseComponents from '@core/baseComponents/index';
import { ComponentsObject } from '@core/types/types';
import { EditableWrapper } from '@core/components/index';

export const Components = {
  ...baseComponents,
};

interface RenderProps {
  data: VDomNode | VDomNode[];
  editable?: boolean;
}

const Render: FunctionComponent<RenderProps> = ({ data, editable }) => {
  const renderedReactElement = useMemo(() => {
    return traverse(data, undefined, (vdomTreeNode): any => {
      const [MatchedComponent] =
        Object.values(Components as ComponentsObject).filter((value) => getNameProperty(value) === vdomTreeNode.name) ||
        [];
      if (typeof MatchedComponent !== 'undefined') {
        const { children, ...validProps } = vdomTreeNode || {};
        if (vdomTreeNode && Array.isArray(children) && children.length > 0) {
          // @ts-ignore
          return (
            <MatchedComponent
              key={vdomTreeNode.id}
              {...validProps}
              _editable={editable}
              renderEditableWrapper={editable ? EditableWrapper : undefined}
            >
              {children}
            </MatchedComponent>
          );
        } else {
          // @ts-ignore
          return (
            <MatchedComponent
              key={vdomTreeNode.id}
              {...validProps}
              _editable={editable}
              renderEditableWrapper={editable ? EditableWrapper : undefined}
            />
          );
        }
      }
    });
  }, [data, editable]);
  return <>{renderedReactElement}</>;
};

export default Render;
