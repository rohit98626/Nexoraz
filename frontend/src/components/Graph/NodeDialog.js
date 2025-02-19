import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';

const NodeDialog = ({ open, onClose, onSubmit }) => {
  const [nodeData, setNodeData] = useState({
    label: '',
    type: 'concept',
    properties: {},
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(nodeData);
    setNodeData({ label: '', type: 'concept', properties: {} });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New Node</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Node Label"
            fullWidth
            value={nodeData.label}
            onChange={(e) =>
              setNodeData({ ...nodeData, label: e.target.value })
            }
            required
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Node Type</InputLabel>
            <Select
              value={nodeData.type}
              onChange={(e) =>
                setNodeData({ ...nodeData, type: e.target.value })
              }
            >
              <MenuItem value="concept">Concept</MenuItem>
              <MenuItem value="topic">Topic</MenuItem>
              <MenuItem value="resource">Resource</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Add Node
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default NodeDialog;