import React, { useState, useEffect } from 'react';

import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem from '@mui/lab/TreeItem';

interface TreeNode {
  parent: TreeNode|null;
  children: TreeNode[];
  id: string;
};

//class TreeNode {
//  parent: TreeNode | null;
//  children: TreeNode[];
//  id: string;
//
//  constructor(parent: TreeNode|null, children: TreeNode[], id: string) {
//    this.parent = parent;
//    this.children = children;
//    this.id = id;
//  }
//};


const MainContainer = () => {

  const buildTree = () => {
    //var tmp = new TreeNode(null, [], "root");
    //tmp.children.push(new TreeNode(tmp, [], "child1" ));
    //tmp.children.push(new TreeNode(tmp, [], "child2" ));

    const tmp: TreeNode = { parent: null, children: [], id: "root" };
    const child1: TreeNode = { parent: tmp, children: [], id: "child1"};
    const child2: TreeNode = { parent: tmp, children: [], id: "child2"};
    tmp.children.push(child1);
    tmp.children.push(child2);
    const grandChild1: TreeNode = { parent: child1, children: [], id: "grandChild1"};
    child1.children.push(grandChild1);
    return tmp;
  };

  const [tree, setTree] = useState(buildTree());

  const nodeIdToColorDict: {[key: string]: string} = {
    "root": "lavenderblush",
    "child": "honeydew",
    "grandChild": "aliceblue"
  };

  const nodeIdToColor = (nodeId: string) => {
    for (var name of Object.keys(nodeIdToColorDict)) {
      if (nodeId.includes(name)) {
        return nodeIdToColorDict[name];
      }
    }
    return nodeIdToColorDict["root"];
  };
  
  const renderTree = (nodes: TreeNode) => (
    <TreeItem key={nodes.id} nodeId={nodes.id} label={nodes.id}
              sx={{background: nodeIdToColor(nodes.id)}}>
      <div>●</div>
      {Array.isArray(nodes.children)
        ? nodes.children.map((node) => renderTree(node))
        : null}
    </TreeItem>
  );

  return (
    <TreeView
      aria-label="test"
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpanded={['root']}
      defaultExpandIcon={<ChevronRightIcon />}
    >
      {renderTree(tree)}
    </TreeView>
  );
};

export default MainContainer;
