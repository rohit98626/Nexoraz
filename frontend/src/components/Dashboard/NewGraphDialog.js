import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button
} from '@mui/material';

const NewGraphDialog = ({ open, onClose, onSubmit }) => {
  const [graphData, setGraphData] = useState({
    title: '',
    description: ''
  });

  const handleSubmit = () => {
    onSubmit(graphData);
    setGraphData({ title: '', description: '' });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create New Knowledge Graph</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Title"
          fullWidth
          value={graphData.title}
          onChange={(e) => setGraphData({ ...graphData, title: e.target.value })}
        />
        <TextField
          margin="dense"
          label="Description"
          fullWidth
          multiline
          rows={4}
          value={graphData.description}
          onChange={(e) => setGraphData({ ...graphData, description: e.target.value })}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">Create</Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewGraphDialog; 