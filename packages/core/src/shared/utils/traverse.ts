const traverse = (
  input: VDomNode | VDomNode[],
  startCallback?: (item: VDomNode) => any,
  endCallback?: (item: VDomNode) => any,
): any[] | undefined => {
  const _traverse = (vdomNode: VDomNode): VDomNode => {
    if (vdomNode) {
      if (typeof startCallback === 'function') {
        vdomNode = startCallback(vdomNode);
      }
      if (typeof endCallback !== 'function') {
        endCallback = (v) => v;
      }
      if (Array.isArray(vdomNode.children) && vdomNode.children.length > 0) {
        return endCallback({
          ...vdomNode,
          children: vdomNode.children.map((childVdomNode) => _traverse(childVdomNode) as VDomNode),
        });
      }
      return endCallback(vdomNode);
    } else {
      return vdomNode;
    }
  };
  if (Array.isArray(input)) {
    return input.map((vdomNode) => _traverse(vdomNode));
  } else if (input && typeof input === 'object') {
    // 如果input是单独的VDomNode
    return [_traverse(input)];
  }
};

export default traverse;
