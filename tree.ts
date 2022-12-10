
export interface TreeNode {
  children: TreeNode[];
  id: string;
  depth: number;
  properties: {[key: string]: string};
  evaluations: {[key: string]: string}[];
};


export const search = (_node: TreeNode, _id: string): TreeNode | null => {
  if (_node.id == _id) return _node;
  for (const child of _node.children) {
    const result = search(child, _id);
    if (result != null) return result;
  }
  return null;
};

export const hasChild = (_node: TreeNode, _id: string): boolean => {
  return _node.children.some(child => child.id === _id);
};

export const searchByNode = (node: TreeNode, target: TreeNode): TreeNode | null => {
  if (node === target) return target;
  for (const child of node.children) {
    const result = searchByNode(child, target);
    if (result != null) return result;
  }
  return null;
};

export const listIds = (_node: TreeNode): string[] => {
  return _node.children.reduce((acc: string[], curr: TreeNode)=>[...acc, ...listIds(curr)], [_node.id]);
};

