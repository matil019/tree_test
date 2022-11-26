
export interface TreeNode {
  children: TreeNode[];
  id: string;
  text: string;
  properties?: {[key: string]: string}
};


export const search = (_node: TreeNode, _id: string): TreeNode | null => {
  if (_node.id == _id) return _node;
  for (const child of _node.children) {
    const result = search(child, _id);
    if (result != null) return result;
  }
  return null;
};

export const listIds = (_node: TreeNode): string[] => {
  return _node.children.reduce((acc: string[], curr: TreeNode)=>[...acc, ...listIds(curr)], [_node.id]);
};

