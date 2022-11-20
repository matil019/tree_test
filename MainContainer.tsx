import React, { useState, useEffect } from 'react';

import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem from '@mui/lab/TreeItem';
import Button from '@mui/material/Button';

import { TreeNode, search, listIds } from './tree';

const MainContainer = () => {

  const [count, setCount] = useState(4);

  const [tree, setTree] = useState<TreeNode>(
    { id: "0", text: "root", children: [
        { id: "1", text: "child", children: [{ id: "3", text: "grandchild", children: []}]},
        { id: "2", text: "child", children: []}
      ]
    });

  const [expanded, setExpanded] = useState(["0"]);

  useEffect(()=>{
    const ids = listIds(tree);
    setExpanded(ids);
  }, []);

  const handleToggle = (e: React.SyntheticEvent, nodeIds: string[]) => {
    console.log("handleToggle", nodeIds);
    setExpanded(nodeIds);
  };

  const handleAddChild = (nodeId: string) => () => {
    const node = search(tree, nodeId);
    const textToChildText = (text: string): string => {
      if (text.includes("root")) {
        return "child";
      } else if (text.includes("child")) {
        return "grand" + text;
      } else {
        return "???";
      }
    };
    if (node != null) {
    const newId = ""+count;
    node.children =
      [...node.children, { id: newId, text: textToChildText(node.text), children: [] }];
    setTree({...tree});
    setCount(count + 1);
    setExpanded([...expanded, newId]);
    }
  };

  const nodeIdToColorDict: {[key: string]: string} = {
    "root": "lavenderblush",
    "grand": "aliceblue",
    "child": "honeydew", // "child" should be later than "grand"
  };

  const nodeToColor = (node: TreeNode) => {
    for (var name of Object.keys(nodeIdToColorDict)) {
      if (node.text.includes(name)) {
        return nodeIdToColorDict[name];
      }
    }
    return nodeIdToColorDict["root"];
  };
  
  const renderTree = (nodes: TreeNode) => (
    <TreeItem key={nodes.id} nodeId={nodes.id} label={nodes.text}
              sx={{background: nodeToColor(nodes)}}>
      <Button onClick={handleAddChild(nodes.id)} variant="outlined">Add</Button>
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
      expanded={expanded}
      onNodeToggle={handleToggle}
    >
      {renderTree(tree)}
    </TreeView>
  );
};

export default MainContainer;

