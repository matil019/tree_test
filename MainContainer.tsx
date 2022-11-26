import React, { useState, useEffect } from 'react';

import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem from '@mui/lab/TreeItem';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

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

  //const [propertyTemplate, setPropertyTemplate] = useState({"text": "default"});
  const propertyTemplate = {"text": "default"};

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
    node.children = [
      ...node.children,
        { id: newId, text: textToChildText(node.text),
        children: [], properties: propertyTemplate }
      ];
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

  const nodeToLabel = (node: TreeNode) => {
    const depth = checkDepthForward(node);
    const nchild = node.children.length;
    return (nchild == 0 ? "" : `分岐： ${nchild} `)
         + (depth  == 0 ? "" : `最大深さ: ${depth} `);
  };

  const checkDepthForward = (node: TreeNode): number => {
    if (node.children.length <= 0) return 0;
    return node.children.reduce((acc, curr)=> Math.max(acc, checkDepthForward(curr)), 0) + 1;
  };

  const handleChange = (node: TreeNode) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (node.properties != null) 
      node.properties["text"] = e.target.value;
    setTree({...tree});
  };
  
  const renderTree = (nodes: TreeNode) => (
    <TreeItem key={nodes.id} nodeId={nodes.id} label={`${nodes.text} ${nodeToLabel(nodes)}`}
              sx={{background: nodeToColor(nodes), ml: 1.5}}>
      <Button onClick={handleAddChild(nodes.id)} variant="outlined">Add</Button>
      <TextField label="テキスト"
                 value={nodes.properties == null ? "" : nodes.properties["text"]}
                 onChange={handleChange(nodes)}/>
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

