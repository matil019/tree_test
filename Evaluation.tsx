import React, { useState, useEffect } from 'react';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import { TreeNode } from './tree';

interface Props {
  node: TreeNode;
  index: number;
  evaluation: {[key: string]: string};
  handleChange: (node: TreeNode, key: string) => (e: React.ChangeEvent<HTMLInputElement>)=>void;
  deleteEvaluation: (node: TreeNode, index: number) => () => void;
};

const Evaluation = (props: Props) => {
  
  return (
    <Stack key={"evaluations-stack-"+props.node.id+"-"+props.index} direction="column" justifyContent="flex-start">
      {Object.entries(props.evaluation).map(([key, value]) =>
        <TextField label={key} key={"textfield-treeitem-evaluations-"+key} sx={{p: 1}}
                   value={value} onChange={props.handleChange(props.node, key)}
                   size="small"/>
      )}
      <Button variant="outlined" onClick={props.deleteEvaluation(props.node, props.index)}
              size="small" color="error">
        評価の削除
      </Button>
    </Stack>
 );
};

export default Evaluation;

