import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Paper, TextField, IconButton, Tooltip, Divider } from '@mui/material';
import axios from '../../utils/axios';
import { Network } from 'vis-network/standalone';
import 'vis-network/styles/vis-network.css';
import SearchIcon from '@mui/icons-material/Search';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';
import { 
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Refresh as RefreshIcon,
  ViewModule as ViewModuleIcon
} from '@mui/icons-material';

const Graph = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [graph, setGraph] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [network, setNetwork] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isPhysicsEnabled, setIsPhysicsEnabled] = useState(true);
  const [layout, setLayout] = useState('force'); // 'force' or 'hierarchical'

  useEffect(() => {
    const fetchGraph = async () => {
      try {
        const response = await axios.get(`/api/graphs/${id}`);
        if (response.data) {
          setGraph(response.data);
        } else {
          setError('Graph not found');
        }
      } catch (error) {
        console.error('Error fetching graph:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGraph();
  }, [id]);

  useEffect(() => {
    if (!graph) return;

    // Node and edge styling
    const nodes = graph.nodes.map(node => ({
      id: node.id,
      label: node.label,
      title: node.description,
      color: {
        background: getNodeColor(node.type),
        border: '#ffffff',
        highlight: {
          background: '#ffffff',
          border: getNodeColor(node.type)
        }
      },
      font: {
        size: node.type === 'main' ? 20 : 16,
        color: '#ffffff',
        background: 'rgba(10, 25, 47, 0.95)'
      },
      size: node.type === 'main' ? 40 : 30
    }));

    const edges = graph.edges.map(edge => ({
      from: edge.source,
      to: edge.target,
      label: edge.label,
      color: { color: '#64ffda', opacity: 0.6 },
      font: {
        size: 16,
        color: '#ffffff',
        background: 'rgba(10, 25, 47, 0.95)',
        strokeWidth: 0,
        align: 'horizontal'
      },
      arrows: { to: { enabled: true, scaleFactor: 0.7 } },
      smooth: { type: 'straightCross', roundness: 0.2 }
    }));

    const options = {
      nodes: {
        shape: 'dot',
        size: 30,
        font: {
          size: 16,
          color: '#ffffff',
          face: 'Poppins',
          background: 'rgba(10, 25, 47, 0.95)',
          strokeWidth: 0,
          multi: false,
          vadjust: -30
        },
        borderWidth: 2,
        shadow: {
          enabled: true,
          color: 'rgba(0,0,0,0.2)',
          size: 5
        }
      },
      edges: {
        width: 2,
        color: {
          color: '#64ffda',
          opacity: 0.6,
          highlight: '#ffffff'
        },
        font: {
          size: 14,
          color: '#ffffff',
          face: 'Poppins',
          background: 'rgba(10, 25, 47, 0.95)',
          strokeWidth: 0,
          align: 'horizontal',
          vadjust: -10
        },
        arrows: {
          to: {
            enabled: true,
            scaleFactor: 0.5
          }
        },
        smooth: {
          enabled: true,
          type: 'cubicBezier',
          roundness: 0.5
        },
        length: 200
      },
      layout: {
        hierarchical: {
          enabled: true,
          direction: 'UD',
          sortMethod: 'directed',
          nodeSpacing: 150,
          levelSeparation: 150
        }
      },
      physics: {
        enabled: false,
        hierarchicalRepulsion: {
          centralGravity: 0.0,
          springLength: 200,
          springConstant: 0.01,
          nodeDistance: 150,
          damping: 0.09
        },
        solver: 'hierarchicalRepulsion'
      },
      interaction: {
        hover: true,
        zoomView: true,
        dragView: true,
        dragNodes: true,
        navigationButtons: true,
        keyboard: true
      }
    };

    // Create and configure the network
    const container = document.getElementById('network-graph');
    if (container) {
      const networkInstance = new Network(container, { nodes, edges }, options);
      
      // Initial positioning
      const mainNode = graph.nodes.find(n => n.type === 'main');
      if (mainNode) {
        networkInstance.once('stabilized', () => {
          positionNodesRadially(networkInstance, graph.nodes, mainNode.id);
          networkInstance.setOptions({ 
            physics: { enabled: false },
            interaction: {
              zoomView: true,
              dragView: true,
              dragNodes: true,
              initialZoom: 1  // Set initial zoom level
            }
          });
        });
      }

      // Add click handler
      networkInstance.on('click', function(params) {
        if (params.nodes.length > 0) {
          const nodeId = params.nodes[0];
          const node = graph.nodes.find(n => n.id === nodeId);
          setSelectedNode(node);
          setDialogOpen(true);
        }
      });

      // Add double-click handler
      networkInstance.on('doubleClick', function(params) {
        if (params.nodes.length > 0) {
          const nodeId = params.nodes[0];
          const connectedEdges = networkInstance.getConnectedEdges(nodeId);
          const currentVisibility = networkInstance.getEdgesById(connectedEdges[0]).hidden || false;
          
          connectedEdges.forEach(edgeId => {
            networkInstance.updateEdge(edgeId, { hidden: !currentVisibility });
          });
          
          // Get connected nodes
          const connectedNodes = connectedEdges.reduce((nodes, edgeId) => {
            const edge = networkInstance.getEdgesById(edgeId);
            return [...nodes, edge.from, edge.to];
          }, []);
          
          // Hide/show connected nodes
          connectedNodes.forEach(nodeId => {
            if (nodeId !== params.nodes[0]) {  // Don't hide the clicked node
              networkInstance.updateNode(nodeId, { hidden: !currentVisibility });
            }
          });
        }
      });

      setNetwork(networkInstance);
    }

    return () => {
      if (network) {
        network.destroy();
      }
    };
  }, [graph]);

  // Helper functions for node styling
  function getNodeColor(type) {
    switch (type) {
      case 'main': return '#64ffda';
      case 'concept': return '#00bcd4';
      case 'feature': return '#7c3aed';
      default: return '#64ffda';
    }
  }

  function getNodeSize(type) {
    switch (type) {
      case 'main': return 35;
      case 'concept': return 25;
      case 'feature': return 20;
      default: return 15;
    }
  }

  function getNodeShape(type) {
    switch (type) {
      case 'main': return 'star';
      case 'concept': return 'hexagon';
      case 'feature': return 'diamond';
      case 'person': return 'circularImage';
      case 'event': return 'triangle';
      case 'location': return 'square';
      case 'organization': return 'database';
      default: return 'dot';
    }
  }

  function getNodeLevel(node, graph) {
    if (node.type === 'main') return 0;
    
    // Find shortest path to main node
    const mainNode = graph.nodes.find(n => n.type === 'main');
    if (!mainNode) return 1;

    const edges = graph.edges.map(e => ({
      from: e.source,
      to: e.target
    }));

    let level = 1;
    let currentNodes = [mainNode.id];
    let visited = new Set([mainNode.id]);

    while (currentNodes.length > 0) {
      const nextNodes = [];
      for (const currentId of currentNodes) {
        const connectedEdges = edges.filter(e => e.from === currentId || e.to === currentId);
        for (const edge of connectedEdges) {
          const nextId = edge.from === currentId ? edge.to : edge.from;
          if (!visited.has(nextId)) {
            if (nextId === node.id) return level;
            visited.add(nextId);
            nextNodes.push(nextId);
          }
        }
      }
      currentNodes = nextNodes;
      level++;
    }

    return level;
  }

  const handleSearch = () => {
    if (!network || !searchTerm) return;
    
    const matchingNodes = graph.nodes.filter(node => 
      node.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (matchingNodes.length > 0) {
      const nodeIds = matchingNodes.map(node => node.id);
      network.selectNodes(nodeIds);
      network.fit({
        nodes: nodeIds,
        animation: true
      });
    }
  };

  const handleZoomIn = () => {
    if (!network) return;
    const currentScale = network.getScale();
    network.moveTo({
      scale: currentScale * 1.5,
      animation: {
        duration: 500,
        easingFunction: 'easeInOutQuad'
      }
    });
  };

  const handleZoomOut = () => {
    if (!network) return;
    const currentScale = network.getScale();
    network.moveTo({
      scale: currentScale * 0.75,
      animation: {
        duration: 500,
        easingFunction: 'easeInOutQuad'
      }
    });
  };

  const handleFitView = () => {
    if (!network) return;
    network.fit({
      animation: {
        duration: 1000,
        easingFunction: 'easeInOutQuad'
      }
    });
  };

  const togglePhysics = () => {
    network?.setOptions({ physics: { enabled: !isPhysicsEnabled } });
    setIsPhysicsEnabled(!isPhysicsEnabled);
  };

  const resetLayout = () => {
    network?.stabilize();
  };

  const toggleLayout = () => {
    const newLayout = layout === 'force' ? 'hierarchical' : 'force';
    setLayout(newLayout);
    network?.setOptions({
      layout: {
        hierarchical: {
          enabled: newLayout === 'hierarchical',
          direction: 'UD',
          sortMethod: 'directed',
          nodeSpacing: 200,
          levelSeparation: 250
        }
      }
    });
  };

  const Legend = () => {
    const categories = [
      { type: 'main', label: 'Main Topic', color: '#64ffda', shape: 'star' },
      { type: 'concept', label: 'Concept', color: '#00bcd4', shape: 'hexagon' },
      { type: 'feature', label: 'Feature', color: '#7c3aed', shape: 'diamond' },
      { type: 'location', label: 'Location', color: '#4caf50', shape: 'square' },
      { type: 'organization', label: 'Organization', color: '#ff9800', shape: 'database' }
    ];

    return (
      <Box
        sx={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          zIndex: 1,
          bgcolor: 'rgba(17, 34, 64, 0.9)',
          p: 2,
          borderRadius: 2,
          boxShadow: 3
        }}
      >
        <Typography variant="subtitle2" color="#64ffda" gutterBottom>
          Node Types
        </Typography>
        {categories.map((cat) => (
          <Box key={cat.type} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Box
              sx={{
                width: 16,
                height: 16,
                bgcolor: cat.color,
                borderRadius: cat.shape === 'star' ? '50%' : 1,
                mr: 1
              }}
            />
            <Typography variant="caption" color="#ffffff">
              {cat.label}
            </Typography>
          </Box>
        ))}
      </Box>
    );
  };

  const GraphStats = ({ graph }) => (
    <Box
      sx={{
        position: 'absolute',
        top: 80,
        right: 20,
        zIndex: 1,
        bgcolor: 'rgba(17, 34, 64, 0.9)',
        p: 2,
        borderRadius: 2,
        boxShadow: 3
      }}
    >
      <Typography variant="subtitle2" color="#64ffda" gutterBottom>
        Graph Statistics
      </Typography>
      <Typography variant="caption" color="#ffffff" display="block">
        Nodes: {graph?.nodes?.length || 0}
      </Typography>
      <Typography variant="caption" color="#ffffff" display="block">
        Edges: {graph?.edges?.length || 0}
      </Typography>
      <Typography variant="caption" color="#ffffff" display="block">
        Density: {((graph?.edges?.length || 0) / ((graph?.nodes?.length || 1) * ((graph?.nodes?.length || 1) - 1))).toFixed(2)}
      </Typography>
    </Box>
  );

  // Update the node positioning function
  const positionNodesRadially = (network, nodes, mainNodeId) => {
    const mainNode = nodes.find(n => n.id === mainNodeId);
    const otherNodes = nodes.filter(n => n.id !== mainNodeId);
    
    // Center position
    const center = { x: 0, y: 0 };
    
    // Set main node position
    network.moveNode(mainNodeId, center.x, center.y);

    // Position other nodes in a circle
    const radius = 300;
    const angleStep = (2 * Math.PI) / otherNodes.length;
    
    otherNodes.forEach((node, index) => {
      const angle = angleStep * index;
      const x = center.x + radius * Math.cos(angle);
      const y = center.y + radius * Math.sin(angle);
      network.moveNode(node.id, x, y);
    });

    // Optional: Gentle fit only on initial load
    if (!network.getScale()) {  // Only if not already scaled
      network.fit({
        animation: {
          duration: 1000,
          easingFunction: 'easeOutQuad'
        }
      });
    }
  };

  const generateDetailedGraph = async (title, description) => {
    try {
      const response = await fetch('http://localhost:5000/api/generate-graph-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          title,
          description,
          type: 'concept'
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      return data;
    } catch (error) {
      console.error('Error generating graph data:', error);
      throw error;
    }
  };

  if (loading) {
    return (
      <Box p={3} display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3} textAlign="center">
        <Typography color="error" gutterBottom>{error}</Typography>
        <Button variant="contained" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100vh', bgcolor: '#0a192f', position: 'relative' }}>
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        bgcolor: 'rgba(10, 25, 47, 0.8)',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1
      }}>
        <Button 
          variant="outlined" 
          onClick={() => navigate('/dashboard')}
          sx={{ color: '#64ffda', borderColor: '#64ffda' }}
        >
          Back to Dashboard
        </Button>
        <Typography variant="h4" sx={{ color: '#64ffda' }}>
          {graph?.title}
        </Typography>
      </Box>

      <Box sx={{
        position: 'absolute',
        top: 80,
        left: 20,
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        bgcolor: 'rgba(17, 34, 64, 0.9)',
        p: 2,
        borderRadius: 2
      }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            size="small"
            placeholder="Search nodes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#ffffff',
                '& fieldset': { borderColor: '#64ffda' },
                '&:hover fieldset': { borderColor: '#64ffda' },
              }
            }}
          />
          <IconButton onClick={handleSearch} sx={{ color: '#64ffda' }}>
            <SearchIcon />
          </IconButton>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
          <Tooltip title="Zoom In">
            <IconButton 
              onClick={handleZoomIn}
              sx={{ color: '#64ffda' }}
            >
              <ZoomInIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Zoom Out">
            <IconButton 
              onClick={handleZoomOut}
              sx={{ color: '#64ffda' }}
            >
              <ZoomOutIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Fit View">
            <IconButton 
              onClick={handleFitView}
              sx={{ color: '#64ffda' }}
            >
              <CenterFocusStrongIcon />
            </IconButton>
          </Tooltip>
          <Divider orientation="vertical" flexItem sx={{ bgcolor: '#64ffda', opacity: 0.3 }} />
          <Tooltip title={isPhysicsEnabled ? "Pause Physics" : "Resume Physics"}>
            <IconButton 
              onClick={togglePhysics}
              sx={{ color: '#64ffda' }}
            >
              {isPhysicsEnabled ? <PauseIcon /> : <PlayIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Reset Layout">
            <IconButton 
              onClick={resetLayout}
              sx={{ color: '#64ffda' }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={`Switch to ${layout === 'force' ? 'Hierarchical' : 'Force'} Layout`}>
            <IconButton 
              onClick={toggleLayout}
              sx={{ color: '#64ffda' }}
            >
              <ViewModuleIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <GraphStats graph={graph} />
      <Legend />
      <div id="network-graph" style={{ height: '100%', width: '100%', background: '#0a192f' }} />

      {/* Node Information Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: '#112240',
            color: '#ffffff',
            borderRadius: 2
          }
        }}
      >
        <DialogTitle sx={{ 
          borderBottom: '1px solid #1d4ed8',
          color: '#64ffda'
        }}>
          {selectedNode?.label}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Typography variant="subtitle1" color="#8892b0" gutterBottom>
            Type: {selectedNode?.type}
          </Typography>
          <Typography variant="body1" color="#ffffff">
            {selectedNode?.description}
          </Typography>
          
          {/* Show connected nodes */}
          {graph?.edges && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" color="#64ffda" gutterBottom>
                Connections
              </Typography>
              {graph.edges
                .filter(edge => 
                  edge.source === selectedNode?.id || 
                  edge.target === selectedNode?.id
                )
                .map((edge, index) => {
                  const connectedNode = graph.nodes.find(n => 
                    n.id === (edge.source === selectedNode?.id ? edge.target : edge.source)
                  );
                  return (
                    <Paper 
                      key={index}
                      sx={{ 
                        p: 1, 
                        mt: 1, 
                        bgcolor: '#1e293b',
                        border: '1px solid #1d4ed8'
                      }}
                    >
                      <Typography color="#ffffff">
                        {edge.source === selectedNode?.id ? 
                          `${edge.label} → ${connectedNode?.label}` : 
                          `${connectedNode?.label} → ${edge.label}`}
                      </Typography>
                    </Paper>
                  );
                })}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setDialogOpen(false)}
            variant="contained"
            sx={{ 
              bgcolor: '#64ffda',
              color: '#0a192f',
              '&:hover': {
                bgcolor: '#4caf50'
              }
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Graph; 