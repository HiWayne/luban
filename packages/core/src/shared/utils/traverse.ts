const traverse = (
  input: VDomNode | VDomNode[],
  beginWork?: (item: VDomNode) => any,
  completeWork?: (item: VDomNode) => any,
): any[] | undefined => {
  const _traverse = (vdomNode: VDomNode, index: number, hierarchicalRecords: number[]): VDomNode => {
    if (vdomNode) {
      let hierarchicalRecordsOfThis: number[];
      if (Array.isArray(vdomNode.hierarchicalRecords) && vdomNode.hierarchicalRecords.length > 0) {
        hierarchicalRecordsOfThis = vdomNode.hierarchicalRecords;
      } else {
        hierarchicalRecordsOfThis = [...hierarchicalRecords];
        hierarchicalRecordsOfThis.push(index);
        vdomNode.hierarchicalRecords = hierarchicalRecordsOfThis;
      }
      if (typeof beginWork === 'function') {
        vdomNode = beginWork(vdomNode);
      }
      if (typeof completeWork !== 'function') {
        completeWork = (v) => v;
      }
      if (Array.isArray(vdomNode.children) && vdomNode.children.length > 0) {
        return completeWork({
          ...vdomNode,
          children: vdomNode.children.map(
            (childVdomNode, index) => _traverse(childVdomNode, index, hierarchicalRecordsOfThis) as VDomNode,
          ),
        });
      }
      return completeWork(vdomNode);
    } else {
      return vdomNode;
    }
  };
  if (Array.isArray(input)) {
    return input.map((vdomNode, index) => _traverse(vdomNode, index, []));
  } else if (input && typeof input === 'object') {
    // 如果input是单独的VDomNode
    return [_traverse(input, 0, [])];
  }
};

export default traverse;
