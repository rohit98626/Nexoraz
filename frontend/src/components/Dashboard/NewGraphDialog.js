import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';

const NewGraphDialog = ({ open, onClose, onSubmit }) => {
  const [graphData, setGraphData] = useState({
    title: '',
    description: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(graphData);
    setGraphData({ title: '', description: '' });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create New Graph</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Graph Title"
            fullWidth
            value={graphData.title}
            onChange={(e) =>
              setGraphData({ ...graphData, title: e.target.value })
            }
            required
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={graphData.description}
            onChange={(e) =>
              setGraphData({ ...graphData, description: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Create
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default NewGraphDialog;