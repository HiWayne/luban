const traverse = (
  input: VDomNode | VDomNode[],
  beginWork?: (item: VDomNode) => any,
  completeWork?: (item: VDomNode) => any,
): any[] | undefined => {
  const _traverse = (vdomNode: VDomNode): VDomNode => {
    if (vdomNode) {
      if (typeof beginWork === 'function') {
        vdomNode = beginWork(vdomNode);
      }
      if (typeof completeWork !== 'function') {
        completeWork = (v) => v;
      }
      if (Array.isArray(vdomNode.children) && vdomNode.children.length > 0) {
        return completeWork({
          ...vdomNode,
          children: vdomNode.children.map((childVdomNode) => _traverse(childVdomNode) as VDomNode),
        });
      }
      return completeWork(vdomNode);
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
