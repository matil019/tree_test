import React, { useState, useEffect } from 'react';

import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem from '@mui/lab/TreeItem';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

import { v4 as uuid } from 'uuid';

import { TreeNode, search, listIds, searchParent } from './tree';

const MainContainer = () => {

  const [tree, setTree] = useState<TreeNode>({
    id: uuid(), depth: 0, children: [],
    properties: {"test": "property"}, evaluations: [{"test": "evaluation"}]
    });

  const [expanded, setExpanded] = useState(["0"]);

  //const [propertyTemplate, setPropertyTemplate] = useState({"text": "default"});
  const propertyTemplate = {
    "text": "default",
    "test": "content",
    "complex": "patterns"
  };
  
  const nodeToDescendantInfo = (node: TreeNode) => {
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
    if (node != null) {
      const newId = uuid();
      node.children = [
        ...node.children,
        { id: newId, depth: node.depth + 1,
          children: [], properties: propertyTemplate, evaluations: []
        },
      ];
      setTree({...tree});
      setExpanded([...expanded, newId]);
    }
  };

  const depthToColor = (depth: number): string => {
    if (depth === 0)
      return "lavenderblush";
    else if (depth === 1)
      return "honeydew";
    else
      return "aliceblue";
  }

  const nodeToColor = (node: TreeNode) => depthToColor(node.depth);

  const nodeToDepthName = (node: TreeNode): string => {
    if (node.depth === 0)
      return "root";
    else
      return "grand".repeat(node.depth - 1) + "child";
  };

  const handleChange = (node: TreeNode, key: string) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
    if (node.properties != null) {
      node.properties[key] = e.target.value;
      setTree({...tree});
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
      <TreeItem nodeId={nodes.id} label={`${nodeToDepthName(nodes)} ${nodeToDescendantInfo(nodes)}`}
                sx={{background: nodeToColor(nodes), ml: 1.5}}>
        <Stack direction="row" spacing={2}>
          <Stack direction="column">
            {nodes.properties != null &&
              Object.entries(nodes.properties).map(([key, value]) =>
                  <TextField label={key} key={"textfield-treeitem-properties-"+key} sx={{p: 1}}
                             value={value} onChange={handleChange(nodes, key)}
                             size="small"/>
                )
            }
            <Stack direction="row" justifyContent="stretch">
              <Button size="small" onClick={handleAddChild(nodes)} variant="outlined" fullWidth>
                次工程の追加
              </Button>
              {nodes !== tree &&
                <Button onClick={deleteNode(nodes.id)} variant="outlined" color="error">削除</Button>
              }
            </Stack>
          </Stack>
          {nodes.evaluations.map((evaluation, index) =>
            <Stack key={"evaluations-stack-"+nodes.id+"-"+index} direction="column" justifyContent="flex-start">
              {Object.entries(evaluation).map(([key, value]) =>
                <TextField label={key} key={"textfield-treeitem-evaluations-"+key} sx={{p: 1}}
                           value={value} onChange={handleChange(nodes, key)}
                           size="small"/>
              )}
              <Button variant="outlined" onClick={deleteEvaluation(nodes, index)}
                      size="small" color="error">
                評価の削除
              </Button>
            </Stack>
          )}
          <Button sx={{height: 40}} size="small" variant="outlined" onClick={addEvaluation(nodes)}>
            評価の追加
          </Button>
        </Stack>
        {nodes.children.map((node) => <div key={node.id}>{renderTree(node)}</div>)}
      </TreeItem>
    );
  }

  return (
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
  );
};

export default MainContainer;

