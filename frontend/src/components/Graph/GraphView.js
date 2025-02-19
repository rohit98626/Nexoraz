import React, { useRef, useEffect, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { Box, Paper, Typography, Button, IconButton } from '@mui/material';
import { Add as AddIcon, ZoomIn, ZoomOut } from '@mui/icons-material';
import NodeDialog from './NodeDialog';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGraph, addNode, addEdge } from '../../features/graph/graphSlice';

const GraphView = () => {
  const graphRef = useRef();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentGraph, loading } = useSelector((state) => state.graph);
  const [nodeDialogOpen, setNodeDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchGraph(id));
  }, [dispatch, id]);

  const handleNodeClick = (node) => {
    // Handle node click
    console.log('Clicked node:', node);
  };

  const handleAddNode = (nodeData) => {
    dispatch(addNode({ graphId: id, nodeData }));
    setNodeDialogOpen(false);
  };

  const handleZoomIn = () => {
    graphRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    graphRef.current.zoomOut();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Box sx={{ height: 'calc(100vh - 64px)', position: 'relative' }}>
      <Paper sx={{ position: 'absolute', top: 16, left: 16, p: 2, zIndex: 1 }}>
        <Typography variant="h6">Graph Controls</Typography>
        <Button
          startIcon={<AddIcon />}
          onClick={() => setNodeDialogOpen(true)}
          variant="contained"
          sx={{ mt: 1 }}
        >
          Add Node
        </Button>
        <Box sx={{ mt: 2 }}>
          <IconButton onClick={handleZoomIn}>
            <ZoomIn />
          </IconButton>
          <IconButton onClick={handleZoomOut}>
            <ZoomOut />
          </IconButton>
        </Box>
      </Paper>

      <ForceGraph2D
        ref={graphRef}
        graphData={currentGraph}
        nodeLabel="label"
        nodeColor={(node) => node.color || '#1976d2'}
        linkColor={() => '#999'}
        onNodeClick={handleNodeClick}
        nodeRelSize={6}
        linkDirectionalParticles={2}
        linkDirectionalParticleSpeed={0.005}
      />

      <NodeDialog
        open={nodeDialogOpen}
        onClose={() => setNodeDialogOpen(false)}
        onSubmit={handleAddNode}
      />
    </Box>
  );
};

export default GraphView;