const handleVdom = (modelTree: ModelTree, stateTree: StateTree) => (vdomNode: VDomNode) => {
  if (vdomNode) {
    return {
      ...vdomNode,
    };
  } else {
    return vdomNode;
  }
};

export default handleVdom;
