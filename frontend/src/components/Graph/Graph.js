import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
<<<<<<< HEAD
import { Box, Typography, Button, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Paper, TextField, IconButton, Tooltip, Divider } from '@mui/material';
=======
import { Box, Typography, Button, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Paper, TextField, IconButton, Tooltip, Divider, List, ListItem, ListItemIcon, ListItemText, Grid, Chip, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Switch, Slider, Drawer, Tabs, Tab } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
>>>>>>> 17e6718 (initial commit)
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
<<<<<<< HEAD
  ViewModule as ViewModuleIcon
} from '@mui/icons-material';

=======
  ViewModule as ViewModuleIcon,
  OpenInNew as OpenInNewIcon,
  Close as CloseIcon,
  FiberManualRecord as FiberManualRecordIcon,
  DownloadOutlined,
  ShareOutlined,
  HistoryOutlined,
  BookmarkOutlined,
  SettingsOutlined,
  InfoOutlined,
  ContentCopy as ContentCopyIcon,
  Image as ImageIcon,
  Brush as BrushIcon,
  Code as CodeIcon
} from '@mui/icons-material';

const TabPanel = ({ children, value, index }) => (
  <div hidden={value !== index}>
    {value === index && children}
  </div>
);

const ToolbarButtons = ({ 
  onExport, 
  onShare, 
  onHistory, 
  onBookmarks, 
  onSettings, 
  onInfo 
}) => (
  <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
    <Tooltip title="Export Graph">
      <IconButton onClick={onExport} sx={{ color: '#64ffda' }}>
        <DownloadOutlined />
      </IconButton>
    </Tooltip>
    <Tooltip title="Share Graph">
      <IconButton onClick={onShare} sx={{ color: '#64ffda' }}>
        <ShareOutlined />
      </IconButton>
    </Tooltip>
    <Tooltip title="History">
      <IconButton onClick={onHistory} sx={{ color: '#64ffda' }}>
        <HistoryOutlined />
      </IconButton>
    </Tooltip>
    <Tooltip title="Bookmarks">
      <IconButton onClick={onBookmarks} sx={{ color: '#64ffda' }}>
        <BookmarkOutlined />
      </IconButton>
    </Tooltip>
    <Tooltip title="Settings">
      <IconButton onClick={onSettings} sx={{ color: '#64ffda' }}>
        <SettingsOutlined />
      </IconButton>
    </Tooltip>
    <Tooltip title="Graph Info">
      <IconButton onClick={onInfo} sx={{ color: '#64ffda' }}>
        <InfoOutlined />
      </IconButton>
    </Tooltip>
  </Box>
);

const ExportDialog = ({ open, onClose, onExport }) => (
  <Dialog 
    open={open} 
    onClose={onClose}
    PaperProps={{
      sx: { bgcolor: '#112240' }
    }}
  >
    <DialogTitle sx={{ color: '#64ffda' }}>Export Graph</DialogTitle>
    <DialogContent>
      <List>
        <ListItem 
          button 
          onClick={() => onExport('PNG')}
          sx={{
            color: '#ffffff',
            '&:hover': { bgcolor: 'rgba(100, 255, 218, 0.1)' }
          }}
        >
          <ListItemIcon>
            <ImageIcon sx={{ color: '#64ffda' }} />
          </ListItemIcon>
          <ListItemText 
            primary="Export as PNG" 
            secondary="Save as image file"
            sx={{
              '& .MuiListItemText-secondary': { color: '#8892b0' }
            }}
          />
        </ListItem>
        
        <ListItem 
          button 
          onClick={() => onExport('SVG')}
          sx={{
            color: '#ffffff',
            '&:hover': { bgcolor: 'rgba(100, 255, 218, 0.1)' }
          }}
        >
          <ListItemIcon>
            <BrushIcon sx={{ color: '#64ffda' }} />
          </ListItemIcon>
          <ListItemText 
            primary="Export as SVG" 
            secondary="Vector graphics format"
            sx={{
              '& .MuiListItemText-secondary': { color: '#8892b0' }
            }}
          />
        </ListItem>
        
        <ListItem 
          button 
          onClick={() => onExport('JSON')}
          sx={{
            color: '#ffffff',
            '&:hover': { bgcolor: 'rgba(100, 255, 218, 0.1)' }
          }}
        >
          <ListItemIcon>
            <CodeIcon sx={{ color: '#64ffda' }} />
          </ListItemIcon>
          <ListItemText 
            primary="Export as JSON" 
            secondary="Save graph data"
            sx={{
              '& .MuiListItemText-secondary': { color: '#8892b0' }
            }}
          />
        </ListItem>
      </List>
    </DialogContent>
  </Dialog>
);

const SettingsDialog = ({ open, onClose, settings, onSettingsChange }) => (
  <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
    <DialogTitle sx={{ color: '#64ffda' }}>Graph Settings</DialogTitle>
    <DialogContent>
      <FormControl fullWidth sx={{ mt: 2 }}>
        <InputLabel>Theme</InputLabel>
        <Select
          value={settings.theme}
          onChange={(e) => onSettingsChange({ ...settings, theme: e.target.value })}
        >
          <MenuItem value="dark">Dark</MenuItem>
          <MenuItem value="light">Light</MenuItem>
        </Select>
      </FormControl>
      
      <FormControl fullWidth sx={{ mt: 2 }}>
        <InputLabel>Edge Style</InputLabel>
        <Select
          value={settings.edgeStyle}
          onChange={(e) => onSettingsChange({ ...settings, edgeStyle: e.target.value })}
        >
          <MenuItem value="curved">Curved</MenuItem>
          <MenuItem value="straight">Straight</MenuItem>
          <MenuItem value="cubicBezier">Bezier</MenuItem>
        </Select>
      </FormControl>

      <Typography sx={{ mt: 2 }}>Node Spacing</Typography>
      <Slider
        value={settings.nodeSpacing}
        onChange={(e, value) => onSettingsChange({ ...settings, nodeSpacing: value })}
        min={50}
        max={300}
        valueLabelDisplay="auto"
      />

      <FormControlLabel
        control={
          <Switch
            checked={settings.showLabels}
            onChange={(e) => onSettingsChange({ ...settings, showLabels: e.target.checked })}
          />
        }
        label="Show Labels"
      />
    </DialogContent>
  </Dialog>
);

const InfoDialog = ({ open, onClose, stats }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle sx={{ color: '#64ffda' }}>Graph Information</DialogTitle>
    <DialogContent>
      <List>
        <ListItem>
          <ListItemText 
            primary="Nodes" 
            secondary={stats.nodeCount} 
          />
        </ListItem>
        <ListItem>
          <ListItemText 
            primary="Edges" 
            secondary={stats.edgeCount} 
          />
        </ListItem>
        <ListItem>
          <ListItemText 
            primary="Density" 
            secondary={stats.density} 
          />
        </ListItem>
        <ListItem>
          <ListItemText 
            primary="Clusters" 
            secondary={stats.clusters} 
          />
        </ListItem>
      </List>
    </DialogContent>
  </Dialog>
);

// Add this custom DialogTitle component
const CustomDialogTitle = ({ children, ...props }) => (
  <DialogTitle 
    {...props} 
    component="div" // Change the root component to div
  >
    {children}
  </DialogTitle>
);

>>>>>>> 17e6718 (initial commit)
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
<<<<<<< HEAD
=======
  const [subgraphData, setSubgraphData] = useState(null);
  const [showSubgraph, setShowSubgraph] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [searchFilters, setSearchFilters] = useState({
    nodeType: 'all',
    relationshipType: 'all',
    dateRange: null
  });
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [annotations, setAnnotations] = useState({});
  const [socket, setSocket] = useState(null);
  const [graphSettings, setGraphSettings] = useState({
    theme: 'dark',
    animationSpeed: 500,
    edgeStyle: 'curved',
    nodeSpacing: 150,
    showLabels: true
  });
  const [graphStats, setGraphStats] = useState({
    nodeCount: 0,
    edgeCount: 0,
    density: 0,
    clusters: 0
  });
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [historyPanelOpen, setHistoryPanelOpen] = useState(false);
  const [bookmarksPanelOpen, setBookmarksPanelOpen] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);

  // Add WebSocket connection for real-time updates
  useEffect(() => {
    // Initialize WebSocket connection
    const ws = new WebSocket('ws://your-server/graph-updates');
    
    ws.onopen = () => {
      console.log('WebSocket Connected');
    };

    ws.onmessage = (event) => {
      const update = JSON.parse(event.data);
      switch (update.type) {
        case 'node_added':
          addNode(update.data);
          break;
        case 'edge_added':
          addEdge(update.data);
          break;
        case 'annotation_added':
          updateAnnotations(update.data);
          break;
        default:
          console.log('Unknown update type:', update.type);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket Disconnected');
    };

    setSocket(ws);

    // Cleanup on unmount
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  // Add these functions for WebSocket handling
  const addNode = (nodeData) => {
    if (!network) return;
    network.body.data.nodes.add(nodeData);
  };

  const addEdge = (edgeData) => {
    if (!network) return;
    network.body.data.edges.add(edgeData);
  };

  const updateAnnotations = (annotationData) => {
    setAnnotations(prev => ({
      ...prev,
      [annotationData.nodeId]: annotationData.annotations
    }));
  };

  // Add history state management
  const applyHistoryState = (state) => {
    if (!network || !state) return;
    
    // Update nodes
    network.body.data.nodes.clear();
    network.body.data.nodes.add(state.nodes);
    
    // Update edges
    network.body.data.edges.clear();
    network.body.data.edges.add(state.edges);
    
    // Update layout if needed
    if (state.layout) {
      network.setOptions({ layout: state.layout });
    }
  };

  // Get current user from localStorage or context
  const currentUser = {
    name: localStorage.getItem('userName') || 'Anonymous User'
  };
>>>>>>> 17e6718 (initial commit)

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
<<<<<<< HEAD
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
=======
      shape: getNodeShape(node.type),
      size: getNodeSize(node.type),
      color: getNodeColor(node.type),
      font: {
        size: node.type === 'main' ? 20 : 16,
        color: '#ffffff',
        background: 'rgba(10, 25, 47, 0.95)',
        strokeWidth: 2,
        strokeColor: '#0a192f',
        align: 'center',
        bold: {
          color: '#ffffff',
          size: 16,
          mod: 'bold'
        }
      },
      shadow: {
        enabled: true,
        color: 'rgba(0,0,0,0.5)',
        size: 10,
        x: 5,
        y: 5
      },
      margin: {
        top: 5,
        right: 5,
        bottom: 5,
        left: 5
      }
>>>>>>> 17e6718 (initial commit)
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
<<<<<<< HEAD
      smooth: { type: 'straightCross', roundness: 0.2 }
=======
      smooth: {
        enabled: true,
        type: 'curvedCW',
        roundness: 0.2,
        forceDirection: 'none'
      },
      hoverWidth: 2,
      selectionWidth: 2
>>>>>>> 17e6718 (initial commit)
    }));

    const options = {
      nodes: {
<<<<<<< HEAD
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
=======
        shape: 'hexagon',
        size: 40,
        font: {
          size: 14,
          color: '#ffffff',
          face: 'Poppins',
          background: 'rgba(10, 25, 47, 0.95)',
          strokeWidth: 2,
          strokeColor: '#0a192f',
          align: 'center',
          vadjust: -65,
          bold: {
            color: '#ffffff',
            size: 16,
            mod: 'bold'
          }
        },
        borderWidth: 3,
        margin: 20,
        shadow: {
          enabled: true,
          color: 'rgba(100, 255, 218, 0.3)',
          size: 15,
          x: 0,
          y: 0
>>>>>>> 17e6718 (initial commit)
        }
      },
      edges: {
        width: 2,
        color: {
          color: '#64ffda',
<<<<<<< HEAD
          opacity: 0.6,
          highlight: '#ffffff'
        },
        font: {
          size: 14,
=======
          opacity: 0.4,
          highlight: '#80ffea',
          hover: '#4caf50',
          inherit: false
        },
        font: {
          size: 13,
>>>>>>> 17e6718 (initial commit)
          color: '#ffffff',
          face: 'Poppins',
          background: 'rgba(10, 25, 47, 0.95)',
          strokeWidth: 0,
          align: 'horizontal',
<<<<<<< HEAD
          vadjust: -10
=======
          vadjust: -15,
          multi: true
>>>>>>> 17e6718 (initial commit)
        },
        arrows: {
          to: {
            enabled: true,
<<<<<<< HEAD
            scaleFactor: 0.5
=======
            type: 'arrow',
            scaleFactor: 0.7
>>>>>>> 17e6718 (initial commit)
          }
        },
        smooth: {
          enabled: true,
<<<<<<< HEAD
          type: 'cubicBezier',
          roundness: 0.5
        },
        length: 200
=======
          type: 'curvedCW',
          roundness: 0.15,
          forceDirection: 'none'
        },
        length: 350,
        selectionWidth: 3,
        hoverWidth: 3
>>>>>>> 17e6718 (initial commit)
      },
      layout: {
        hierarchical: {
          enabled: true,
<<<<<<< HEAD
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
=======
          direction: 'LR',
          sortMethod: 'directed',
          nodeSpacing: 300,
          levelSeparation: 250,
          treeSpacing: 300,
          blockShifting: true,
          edgeMinimization: true,
          parentCentralization: true,
          shakeTowards: 'leaves'
        }
      },
      physics: {
        enabled: false
      },
      interaction: {
        hover: true,
        hoverConnectedEdges: true,
        selectConnectedEdges: true,
        zoomView: true,
        dragView: true,
        dragNodes: false,
        navigationButtons: true,
        keyboard: true,
        tooltipDelay: 200,
        hideEdgesOnDrag: true,
        hideEdgesOnZoom: true,
        zoomSpeed: 0.3
      },
      configure: {
        enabled: false,
        filter: ['physics', 'layout', 'interaction'],
        showButton: true
>>>>>>> 17e6718 (initial commit)
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
<<<<<<< HEAD
      networkInstance.on('click', function(params) {
        if (params.nodes.length > 0) {
          const nodeId = params.nodes[0];
          const node = graph.nodes.find(n => n.id === nodeId);
          setSelectedNode(node);
          setDialogOpen(true);
=======
      networkInstance.on('click', async function(params) {
        if (params.nodes.length > 0) {
          const nodeId = params.nodes[0];
          const node = graph.nodes.find(n => n.id === nodeId);
          
          try {
            // Fetch detailed information for the clicked node
            const response = await fetch('http://localhost:5000/api/node-details', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify({
                topic: node.label,
                type: node.type
              })
            });

            const data = await response.json();
            setSubgraphData(data);
            setSelectedNode(node);
            setShowSubgraph(true);
          } catch (error) {
            console.error('Error fetching node details:', error);
          }
>>>>>>> 17e6718 (initial commit)
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
<<<<<<< HEAD
      case 'main': return '#64ffda';
      case 'concept': return '#00bcd4';
      case 'feature': return '#7c3aed';
      default: return '#64ffda';
=======
      case 'main': return {
        background: '#64ffda',
        border: '#ffffff',
        highlight: { background: '#80ffea', border: '#ffffff' },
        hover: { background: '#4caf50', border: '#ffffff' }
      };
      case 'concept': return {
        background: '#0ea5e9',
        border: '#ffffff',
        highlight: { background: '#38bdf8', border: '#ffffff' },
        hover: { background: '#0284c7', border: '#ffffff' }
      };
      case 'feature': return {
        background: '#8b5cf6',
        border: '#ffffff',
        highlight: { background: '#a78bfa', border: '#ffffff' },
        hover: { background: '#7c3aed', border: '#ffffff' }
      };
      default: return {
        background: '#64ffda',
        border: '#ffffff',
        highlight: { background: '#80ffea', border: '#ffffff' },
        hover: { background: '#4caf50', border: '#ffffff' }
      };
>>>>>>> 17e6718 (initial commit)
    }
  }

  function getNodeSize(type) {
    switch (type) {
<<<<<<< HEAD
      case 'main': return 35;
      case 'concept': return 25;
      case 'feature': return 20;
      default: return 15;
=======
      case 'main': return 50;
      case 'concept': return 40;
      case 'feature': return 35;
      default: return 30;
>>>>>>> 17e6718 (initial commit)
    }
  }

  function getNodeShape(type) {
    switch (type) {
      case 'main': return 'star';
      case 'concept': return 'hexagon';
<<<<<<< HEAD
      case 'feature': return 'diamond';
      case 'person': return 'circularImage';
      case 'event': return 'triangle';
      case 'location': return 'square';
      case 'organization': return 'database';
      default: return 'dot';
=======
      case 'feature': return 'dot';
      default: return 'hexagon';
>>>>>>> 17e6718 (initial commit)
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

<<<<<<< HEAD
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
=======
    // Position nodes in a balanced layout with more spacing
    const levelGroups = {};
    otherNodes.forEach(node => {
      const level = getNodeLevel(node, { nodes, edges: graph.edges });
      if (!levelGroups[level]) levelGroups[level] = [];
      levelGroups[level].push(node);
    });

    Object.entries(levelGroups).forEach(([level, nodes]) => {
      const radius = 250 * parseInt(level);
      nodes.forEach((node, index) => {
        const angle = (2 * Math.PI * index) / nodes.length;
        const x = center.x + radius * Math.cos(angle);
        const y = center.y + radius * Math.sin(angle);
        network.moveNode(node.id, x, y);
      });
    });

    // Fit view with animation
    network.fit({
      animation: {
        duration: 1000,
        easingFunction: 'easeOutQuad'
      }
    });
>>>>>>> 17e6718 (initial commit)
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

<<<<<<< HEAD
=======
  const SubgraphDialog = ({ open, onClose, data, mainTopic }) => {
    const [activeTab, setActiveTab] = useState(0);

    if (!data) return null;

    // Add default values to prevent undefined map errors
    const {
      definition = '',
      overview = '',
      history = {
        origin: '',
        evolution: '',
        milestones: []
      },
      keyFeatures = [],
      applications = [],
      resources = [],
      statistics = {
        usage: '',
        trends: '',
        futureProjections: ''
      }
    } = data;

    const handleTabChange = (event, newValue) => {
      setActiveTab(newValue);
    };

    return (
      <Dialog 
        open={open} 
        onClose={onClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: '#112240',
            color: '#ffffff',
            borderRadius: 2,
            minHeight: '80vh'
          }
        }}
      >
        <CustomDialogTitle sx={{ 
          borderBottom: '1px solid #1d4ed8',
          color: '#64ffda',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          py: 2
        }}>
          <Typography variant="h6">
            {mainTopic}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {data.learnMoreUrl && (
              <Tooltip title="Learn More">
                <IconButton 
                  onClick={() => window.open(data.learnMoreUrl, '_blank')}
                  sx={{ color: '#64ffda' }}
                >
                  <OpenInNewIcon />
                </IconButton>
              </Tooltip>
            )}
            <IconButton onClick={onClose} sx={{ color: '#64ffda' }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </CustomDialogTitle>

        <DialogContent sx={{ py: 3 }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            sx={{
              mb: 3,
              borderBottom: 1,
              borderColor: 'divider',
              '& .MuiTab-root': {
                color: '#8892b0',
                '&.Mui-selected': {
                  color: '#64ffda'
                }
              },
              '& .MuiTabs-indicator': {
                bgcolor: '#64ffda'
              }
            }}
          >
            <Tab label="Overview" />
            <Tab label="Features" />
            <Tab label="Applications" />
            <Tab label="Resources" />
            <Tab label="Statistics" />
          </Tabs>

          <TabPanel value={activeTab} index={0}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Typography variant="h6" color="#64ffda">Definition</Typography>
              <Typography>{definition}</Typography>

              <Typography variant="h6" color="#64ffda">Overview</Typography>
              <Typography sx={{ whiteSpace: 'pre-line' }}>{overview}</Typography>

              <Typography variant="h6" color="#64ffda">History</Typography>
              <Box sx={{ ml: 2 }}>
                <Typography><strong>Origin:</strong> {history.origin}</Typography>
                <Typography><strong>Evolution:</strong> {history.evolution}</Typography>
                <Typography variant="subtitle1" color="#64ffda" sx={{ mt: 1 }}>Key Milestones:</Typography>
                <List>
                  {history.milestones.map((milestone, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <FiberManualRecordIcon sx={{ color: '#64ffda', fontSize: 12 }} />
                      </ListItemIcon>
                      <ListItemText primary={milestone} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Box>
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            <Grid container spacing={3}>
              {keyFeatures.map((feature, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Paper sx={{ p: 2, bgcolor: 'rgba(17, 34, 64, 0.6)', height: '100%' }}>
                    <Typography variant="h6" color="#64ffda">{feature.title}</Typography>
                    <Typography>{feature.description}</Typography>
                    <Typography sx={{ mt: 1, color: '#8892b0' }}>
                      <strong>Importance:</strong> {feature.importance}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </TabPanel>

          <TabPanel value={activeTab} index={2}>
            <Grid container spacing={3}>
              {applications.map((app, index) => (
                <Grid item xs={12} key={index}>
                  <Paper sx={{ p: 2, bgcolor: 'rgba(17, 34, 64, 0.6)' }}>
                    <Typography variant="h6" color="#64ffda">{app.field}</Typography>
                    <Typography>{app.description}</Typography>
                    <Box sx={{ mt: 2 }}>
                      <Typography color="#64ffda">Examples:</Typography>
                      <List>
                        {app.examples?.map((example, i) => (
                          <ListItem key={i}>
                            <ListItemIcon>
                              <FiberManualRecordIcon sx={{ color: '#64ffda', fontSize: 12 }} />
                            </ListItemIcon>
                            <ListItemText primary={example} />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                    <Typography sx={{ mt: 1, color: '#8892b0' }}>
                      <strong>Impact:</strong> {app.impact}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </TabPanel>

          <TabPanel value={activeTab} index={3}>
            <Grid container spacing={3}>
              {resources.map((resource, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Paper sx={{ p: 2, bgcolor: 'rgba(17, 34, 64, 0.6)' }}>
                    <Typography variant="h6" color="#64ffda">{resource.title}</Typography>
                    <Chip 
                      label={resource.type} 
                      size="small" 
                      sx={{ 
                        bgcolor: 'rgba(100, 255, 218, 0.1)',
                        color: '#64ffda',
                        mb: 1 
                      }} 
                    />
                    <Typography>{resource.description}</Typography>
                    {resource.url && (
                      <Button 
                        variant="outlined" 
                        size="small"
                        sx={{ mt: 2, color: '#64ffda', borderColor: '#64ffda' }}
                        onClick={() => window.open(resource.url, '_blank')}
                      >
                        Visit Resource
                      </Button>
                    )}
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </TabPanel>

          <TabPanel value={activeTab} index={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Paper sx={{ p: 2, bgcolor: 'rgba(17, 34, 64, 0.6)' }}>
                <Typography variant="h6" color="#64ffda">Current Usage</Typography>
                <Typography>{statistics.usage}</Typography>
              </Paper>
              
              <Paper sx={{ p: 2, bgcolor: 'rgba(17, 34, 64, 0.6)' }}>
                <Typography variant="h6" color="#64ffda">Trends</Typography>
                <Typography>{statistics.trends}</Typography>
              </Paper>
              
              <Paper sx={{ p: 2, bgcolor: 'rgba(17, 34, 64, 0.6)' }}>
                <Typography variant="h6" color="#64ffda">Future Outlook</Typography>
                <Typography>{statistics.futureProjections}</Typography>
              </Paper>
            </Box>
          </TabPanel>
        </DialogContent>
      </Dialog>
    );
  };

  // Add handleExport function
  const handleExport = async (type) => {
    if (!network || !graph) return;

    try {
      switch (type) {
        case 'PNG':
          // Get network canvas
          const container = document.getElementById('network-graph');
          const canvas = container.getElementsByTagName('canvas')[0];
          
          if (!canvas) {
            console.error('Canvas not found');
            return;
          }

          // Create a temporary canvas with background
          const tempCanvas = document.createElement('canvas');
          const context = tempCanvas.getContext('2d');
          const { width, height } = canvas;
          
          tempCanvas.width = width;
          tempCanvas.height = height;
          
          // Fill background
          context.fillStyle = graphSettings.theme === 'dark' ? '#0a192f' : '#ffffff';
          context.fillRect(0, 0, width, height);
          
          // Draw the network canvas
          context.drawImage(canvas, 0, 0);
          
          // Create download link
          const dataUrl = tempCanvas.toDataURL('image/png');
          const link = document.createElement('a');
          link.download = `${graph.title || 'graph'}-${new Date().toISOString()}.png`;
          link.href = dataUrl;
          link.click();
          break;

        case 'SVG':
          const svgData = network.getSVGString();
          const svgBlob = new Blob([svgData], { type: 'image/svg+xml' });
          const svgUrl = URL.createObjectURL(svgBlob);
          
          const svgLink = document.createElement('a');
          svgLink.download = `${graph.title || 'graph'}-${new Date().toISOString()}.svg`;
          svgLink.href = svgUrl;
          svgLink.click();
          
          URL.revokeObjectURL(svgUrl);
          break;

        case 'JSON':
          const graphData = {
            nodes: graph.nodes,
            edges: graph.edges,
            metadata: {
              title: graph.title,
              description: graph.description,
              created: new Date().toISOString(),
              settings: graphSettings,
              stats: graphStats
            }
          };
          
          const jsonBlob = new Blob([JSON.stringify(graphData, null, 2)], { 
            type: 'application/json' 
          });
          const jsonUrl = URL.createObjectURL(jsonBlob);
          
          const jsonLink = document.createElement('a');
          jsonLink.download = `${graph.title || 'graph'}-${new Date().toISOString()}.json`;
          jsonLink.href = jsonUrl;
          jsonLink.click();
          
          URL.revokeObjectURL(jsonUrl);
          break;

        default:
          console.error('Unknown export type:', type);
      }

      // Close export dialog
      setExportMenuOpen(false);
    } catch (error) {
      console.error('Error exporting graph:', error);
      // You might want to show an error message to the user here
    }
  };

>>>>>>> 17e6718 (initial commit)
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
<<<<<<< HEAD
            <IconButton 
              onClick={handleZoomIn}
              sx={{ color: '#64ffda' }}
            >
=======
            <IconButton onClick={handleZoomIn} sx={{ color: '#64ffda' }}>
>>>>>>> 17e6718 (initial commit)
              <ZoomInIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Zoom Out">
<<<<<<< HEAD
            <IconButton 
              onClick={handleZoomOut}
              sx={{ color: '#64ffda' }}
            >
=======
            <IconButton onClick={handleZoomOut} sx={{ color: '#64ffda' }}>
>>>>>>> 17e6718 (initial commit)
              <ZoomOutIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Fit View">
<<<<<<< HEAD
            <IconButton 
              onClick={handleFitView}
              sx={{ color: '#64ffda' }}
            >
=======
            <IconButton onClick={handleFitView} sx={{ color: '#64ffda' }}>
>>>>>>> 17e6718 (initial commit)
              <CenterFocusStrongIcon />
            </IconButton>
          </Tooltip>
          <Divider orientation="vertical" flexItem sx={{ bgcolor: '#64ffda', opacity: 0.3 }} />
          <Tooltip title={isPhysicsEnabled ? "Pause Physics" : "Resume Physics"}>
<<<<<<< HEAD
            <IconButton 
              onClick={togglePhysics}
              sx={{ color: '#64ffda' }}
            >
=======
            <IconButton onClick={togglePhysics} sx={{ color: '#64ffda' }}>
>>>>>>> 17e6718 (initial commit)
              {isPhysicsEnabled ? <PauseIcon /> : <PlayIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Reset Layout">
<<<<<<< HEAD
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
=======
            <IconButton onClick={resetLayout} sx={{ color: '#64ffda' }}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Toggle Layout">
            <IconButton onClick={toggleLayout} sx={{ color: '#64ffda' }}>
>>>>>>> 17e6718 (initial commit)
              <ViewModuleIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

<<<<<<< HEAD
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
=======
      <div id="network-graph" style={{ height: 'calc(100vh - 64px)', background: '#0a192f' }} />

      {/* Add ToolbarButtons component to the toolbar area */}
      <Box sx={{
        position: 'absolute',
        top: 80,
        right: 20,
        zIndex: 1,
      }}>
        <ToolbarButtons 
          onExport={() => setExportMenuOpen(true)}
          onShare={() => setShareDialogOpen(true)}
          onHistory={() => setHistoryPanelOpen(true)}
          onBookmarks={() => setBookmarksPanelOpen(true)}
          onSettings={() => setSettingsDialogOpen(true)}
          onInfo={() => setInfoDialogOpen(true)}
        />
      </Box>

      {/* Export Menu Dialog */}
      <ExportDialog 
        open={exportMenuOpen} 
        onClose={() => setExportMenuOpen(false)}
        onExport={handleExport}
      />

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onClose={() => setShareDialogOpen(false)}>
        <DialogTitle sx={{ color: '#64ffda' }}>Share Graph</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            value={window.location.href}
            InputProps={{
              readOnly: true,
              endAdornment: (
                <IconButton onClick={() => navigator.clipboard.writeText(window.location.href)}>
                  <ContentCopyIcon />
                </IconButton>
              ),
            }}
          />
        </DialogContent>
      </Dialog>

      {/* History Panel */}
      <Drawer
        anchor="right"
        open={historyPanelOpen}
        onClose={() => setHistoryPanelOpen(false)}
      >
        <Box sx={{ width: 300, p: 2, bgcolor: '#112240', height: '100%', color: '#ffffff' }}>
          <Typography variant="h6" color="#64ffda" gutterBottom>History</Typography>
          <List>
            {history.map((item, index) => (
              <ListItem 
                key={index}
                button
                selected={index === historyIndex}
                onClick={() => {
                  setHistoryIndex(index);
                  applyHistoryState(item);
                }}
              >
                <ListItemText 
                  primary={item.action}
                  secondary={new Date(item.timestamp).toLocaleString()}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Bookmarks Panel */}
      <Drawer
        anchor="right"
        open={bookmarksPanelOpen}
        onClose={() => setBookmarksPanelOpen(false)}
      >
        <Box sx={{ width: 300, p: 2, bgcolor: '#112240', height: '100%', color: '#ffffff' }}>
          <Typography variant="h6" color="#64ffda" gutterBottom>Bookmarks</Typography>
          {/* Add bookmarks implementation */}
        </Box>
      </Drawer>

      {/* Settings Dialog */}
      <SettingsDialog 
        open={settingsDialogOpen} 
        onClose={() => setSettingsDialogOpen(false)}
        settings={graphSettings}
        onSettingsChange={setGraphSettings}
      />

      {/* Info Dialog */}
      <InfoDialog 
        open={infoDialogOpen} 
        onClose={() => setInfoDialogOpen(false)}
        stats={graphStats}
      />

      {/* Existing SubgraphDialog */}
      {subgraphData && (
        <SubgraphDialog
          open={showSubgraph}
          onClose={() => setShowSubgraph(false)}
          data={subgraphData}
          mainTopic={selectedNode?.label}
        />
      )}
>>>>>>> 17e6718 (initial commit)
    </Box>
  );
};

<<<<<<< HEAD
export default Graph; 
=======
export default Graph;
>>>>>>> 17e6718 (initial commit)
