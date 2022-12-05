import React, { useState, useEffect } from 'react';

import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem from '@mui/lab/TreeItem';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

import { v4 as uuid } from 'uuid';

import { TreeNode, search, listIds, searchParent } from './tree';

import Evaluation from './Evaluation';

const MainContainer = () => {

  const [tree, setTree] = useState<TreeNode>({
    id: uuid(), text: "root", children: [],
    properties: {"test": "property"}, evaluations: [{"test": "evaluation"}]
    });

  const [expanded, setExpanded] = useState(["0"]);

  const [isBusy, setIsBusy] = useState(false);

  //const [propertyTemplate, setPropertyTemplate] = useState({"text": "default"});
  const propertyTemplate = {
    "text": "default",
    "test": "content",
    "complex": "patterns"
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


  useEffect(()=>{
    const ids = listIds(tree);
    setExpanded(ids);
  }, []);

  const handleToggle = (e: React.SyntheticEvent, nodeIds: string[]) => {
    console.log("handleToggle", nodeIds);
    setExpanded(nodeIds);
  };

  const handleAddChild = (node: TreeNode) => () => {
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
    const newId = uuid();
    node.children = [
      ...node.children,
        { id: newId, text: textToChildText(node.text),
        children: [], properties: propertyTemplate, evaluations: [] }
      ];
    setTree({...tree});
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


  const handleChange = (node: TreeNode, key: string) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
    if (node.properties != null) {
      node.properties[key] = e.target.value;
      //setTree({...tree});
    }
  };

  const evaluationTemplate = {
    "evaluation": "template",
    "test": "points",
  };
  
  const addEvaluation = (node: TreeNode) => () => {
    node.evaluations = [...node.evaluations, {...evaluationTemplate}];
    setTree({...tree});
  };

  const deleteEvaluation = (node: TreeNode, index: number) => () => {
    node.evaluations = node.evaluations.filter((_, i) => i != index);
    setTree({...tree});
  };

  const deleteNode = (nodeId: string) => () => {
    const parent = searchParent(tree, nodeId);
    if (parent != null) {
      parent.children = parent.children.filter((node) => node.id != nodeId);
      setTree({...tree});
    }
  };
  
  const renderTree = (nodes: TreeNode) => {
    console.log(`renderTree(${nodes.id}) called.`);
    return (
    <TreeItem key={nodes.id} nodeId={nodes.id} label={`${nodes.text} ${nodeToLabel(nodes)}`}
              sx={{background: nodeToColor(nodes), ml: 1.5}}>
      <Stack direction="row" spacing={2}>
        <Stack direction="column">
          {nodes.properties != null
            ? Object.entries(nodes.properties!).map(([key, value])=>
                <TextField label={key} key={"textfield-treeitem-properties-"+key} sx={{p: 1}}
                           defaultValue={value} onChange={handleChange(nodes, key)}
                           size="small"/>
              )
            : null}
          <Stack direction="row" justifyContent="stretch">
            <Button size="small" onClick={handleAddChild(nodes)} variant="outlined" fullWidth>
              次工程の追加
            </Button>
            {nodes !== tree
              ? <Button onClick={deleteNode(nodes.id)} variant="outlined" color="error">削除</Button>
              : null
            }
          </Stack>
        </Stack>
        {Array.isArray(nodes.evaluations)
          ? nodes.evaluations.map((evaluation, index)=>
              <Evaluation index={index} node={nodes} handleChange={handleChange}
                          deleteEvaluation={deleteEvaluation} evaluation={evaluation}/>)
          : null
        }
        <Button sx={{height: 40}} size="small" variant="outlined" onClick={addEvaluation(nodes)}>
          評価の追加
        </Button>
      </Stack>
      {Array.isArray(nodes.children)
        ? nodes.children.map((node) => renderTree(node))
        : null}
    </TreeItem>
    );
  };

  const handleUpdate = async () => {
    setTree({...tree});
    console.log("current tree: ", tree);
  };

  return (
    <>
    <TreeView
      aria-label="test-treeview"
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpanded={['root']}
      defaultExpandIcon={<ChevronRightIcon />}
      expanded={expanded} onNodeToggle={handleToggle}
    >
      <Button variant="outlined">書き込み</Button>
      {renderTree(tree)}
    </TreeView>
    <Button variant="outlined" onClick={handleUpdate}>同期</Button>
    </>
  );
};

export default MainContainer;

