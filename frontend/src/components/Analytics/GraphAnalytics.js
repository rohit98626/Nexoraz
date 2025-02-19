import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  LinearProgress,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const GraphAnalytics = ({ graphData }) => {
  const stats = {
    totalNodes: graphData.nodes.length,
    totalEdges: graphData.edges.length,
    nodeTypes: graphData.nodes.reduce((acc, node) => {
      acc[node.type] = (acc[node.type] || 0) + 1;
      return acc;
    }, {}),
    completionRate: calculateCompletionRate(graphData),
  };

  const chartData = Object.entries(stats.nodeTypes).map(([type, count]) => ({
    type,
    count,
  }));

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Graph Analytics
      </Typography>
      
      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Nodes
              </Typography>
              <Typography variant="h4">{stats.totalNodes}</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Connections
              </Typography>
              <Typography variant="h4">{stats.totalEdges}</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Completion Rate
              </Typography>
              <Typography variant="h4">
                {stats.completionRate}%
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={stats.completionRate} 
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Node Types Chart */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Node Distribution by Type
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#2196f3" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

const calculateCompletionRate = (graphData) => {
  // Implement your completion rate logic here
  return Math.round((graphData.nodes.length / 20) * 100);
};

export default GraphAnalytics;