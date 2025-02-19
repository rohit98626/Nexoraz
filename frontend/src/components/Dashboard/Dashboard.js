import React, { useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGraphs, createGraph } from '../../features/graph/graphSlice';
import NewGraphDialog from './NewGraphDialog';

const Dashboard = () => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { graphs, loading } = useSelector((state) => state.graph);

  useEffect(() => {
    dispatch(fetchGraphs());
  }, [dispatch]);

  const handleCreateGraph = (graphData) => {
    dispatch(createGraph(graphData)).then((action) => {
      if (action.payload) {
        navigate(`/graph/${action.payload.id}`);
      }
    });
    setDialogOpen(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">My Knowledge Graphs</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDialogOpen(true)}
        >
          Create New Graph
        </Button>
      </Box>

      <Grid container spacing={3}>
        {graphs.map((graph) => (
          <Grid item xs={12} sm={6} md={4} key={graph.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{graph.title}</Typography>
                <Typography color="textSecondary">
                  {graph.description}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Nodes: {graph.nodes.length} | Edges: {graph.edges.length}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => navigate(`/graph/${graph.id}`)}
                >
                  Open Graph
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <NewGraphDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleCreateGraph}
      />
    </Box>
  );
};

export default Dashboard;