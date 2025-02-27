import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
} from '@mui/material';
import {
  AccountTree as GraphIcon,
  Psychology as AIIcon,
  Share as CollaborateIcon,
  Speed as PerformanceIcon,
  Security as SecurityIcon,
  Visibility as VisualizationIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const features = [
  {
    title: 'Dynamic Graph Creation',
    description: 'Create and modify knowledge graphs in real-time with an intuitive interface',
    icon: <GraphIcon sx={{ fontSize: 40, color: '#64ffda' }} />,
  },
  {
    title: 'AI-Powered Insights',
    description: 'Leverage Gemini AI to analyze and enhance your knowledge graphs automatically',
    icon: <AIIcon sx={{ fontSize: 40, color: '#64ffda' }} />,
  },
  {
    title: 'Interactive Visualization',
    description: 'Visualize complex relationships with dynamic, interactive graph layouts',
    icon: <VisualizationIcon sx={{ fontSize: 40, color: '#64ffda' }} />,
  },
  {
    title: 'Secure Access',
    description: 'Enterprise-grade security with JWT authentication and data encryption',
    icon: <SecurityIcon sx={{ fontSize: 40, color: '#64ffda' }} />,
  },
  {
    title: 'High Performance',
    description: 'Built with optimized algorithms for smooth handling of large graphs',
    icon: <PerformanceIcon sx={{ fontSize: 40, color: '#64ffda' }} />,
  },
  {
    title: 'Collaboration Tools',
    description: 'Share and collaborate on knowledge graphs with team members',
    icon: <CollaborateIcon sx={{ fontSize: 40, color: '#64ffda' }} />,
  },
];

const Features = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        bgcolor: '#0a192f',
        color: '#ccd6f6',
        py: 8,
        minHeight: '100vh',
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          align="center"
          sx={{
            mb: 6,
            fontWeight: 'bold',
            color: '#64ffda',
          }}
        >
          Features
        </Typography>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  bgcolor: '#112240',
                  border: '1px solid #233554',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
                  },
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      mb: 2,
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="h2"
                    align="center"
                    sx={{ color: '#ccd6f6' }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    align="center"
                    sx={{ color: '#8892b0' }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Features; 