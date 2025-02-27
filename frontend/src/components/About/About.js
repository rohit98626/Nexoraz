import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Stack,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from '@mui/lab';
import {
  Lightbulb as LightbulbIcon,
  Psychology as PsychologyIcon,
  Diversity3 as Diversity3Icon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';

const teamMembers = [
  {
    name: '',
    role: '',
    image: '',
    description: '',
  },
  {
    name: '',
    role: '',
    image: '',
    description: '',
  },
  {
    name: '',
    role: '',
    image: '',
    description: '',
  },
];

const milestones = [
  {
    year: 'December 2024',
    title: 'Project Inception',
    description: 'NEXORAZ was founded with the vision of revolutionizing knowledge management.',
  },
  {
    year: 'January 2025',
    title: 'Beta Launch',
    description: 'Successfully launched the beta version with core features.',
  },
  {
    year: 'Febraruy 2025',
    title: 'AI Integration',
    description: 'Integrated Gemini AI for advanced graph analysis and insights.',
  },
];

const AboutCard = ({ icon, title, content }) => (
  <Card
    component={motion.div}
    whileHover={{ y: -5 }}
    sx={{
      height: '100%',
      bgcolor: '#112240',
      border: '1px solid #233554',
      transition: 'all 0.3s ease',
      '&:hover': {
        borderColor: '#64ffda',
        boxShadow: '0 0 20px rgba(100, 255, 218, 0.2)',
      },
    }}
  >
    <CardContent>
      <Stack spacing={2} alignItems="center" textAlign="center">
        <Box
          sx={{
            color: '#64ffda',
            bgcolor: 'rgba(100, 255, 218, 0.1)',
            p: 2,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </Box>
        <Typography variant="h6" color="#ccd6f6">
          {title}
        </Typography>
        <Typography color="#8892b0">
          {content}
        </Typography>
      </Stack>
    </CardContent>
  </Card>
);

const About = () => {
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant="h2"
            align="center"
            sx={{
              mb: 6,
              fontWeight: 'bold',
              color: '#64ffda',
            }}
          >
            About Us
          </Typography>

          {/* Mission and Values */}
          <Grid container spacing={4} sx={{ mb: 8 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="h4" color="#ccd6f6" gutterBottom>
                Our Mission
              </Typography>
              <Typography color="#8892b0" paragraph>
                At NEXORAZ, we're dedicated to transforming how people visualize and understand complex information. 
                Our dynamic knowledge graph platform empowers users to create, analyze, and share knowledge in 
                innovative ways.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h4" color="#ccd6f6" gutterBottom>
                Our Vision
              </Typography>
              <Typography color="#8892b0" paragraph>
                We envision a future where knowledge sharing transcends traditional boundaries, where AI and human 
                intelligence work in harmony to create deeper understanding and meaningful connections.
              </Typography>
            </Grid>
          </Grid>

          {/* Core Values */}
          <Typography variant="h4" color="#ccd6f6" align="center" sx={{ mb: 4 }}>
            Core Values
          </Typography>
          <Grid container spacing={4} sx={{ mb: 8 }}>
            {[
              {
                icon: <LightbulbIcon sx={{ fontSize: 40 }} />,
                title: 'Innovation',
                content: 'Pushing boundaries in knowledge visualization and AI integration',
              },
              {
                icon: <PsychologyIcon sx={{ fontSize: 40 }} />,
                title: 'Intelligence',
                content: 'Leveraging cutting-edge AI to enhance human understanding',
              },
              {
                icon: <Diversity3Icon sx={{ fontSize: 40 }} />,
                title: 'Collaboration',
                content: 'Fostering a community of knowledge sharing and growth',
              },
              {
                icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
                title: 'Growth',
                content: 'Continuous improvement and adaptation to new technologies',
              },
            ].map((value, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <AboutCard {...value} />
              </Grid>
            ))}
          </Grid>

          {/* Team Section */}
          <Typography variant="h4" color="#ccd6f6" align="center" sx={{ mb: 4 }}>
            Our Team
          </Typography>
          <Grid container spacing={4} sx={{ mb: 8 }}>
            {teamMembers.map((member, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  component={motion.div}
                  whileHover={{ y: -5 }}
                  sx={{
                    bgcolor: '#112240',
                    border: '1px solid #233554',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: '#64ffda',
                      boxShadow: '0 0 20px rgba(100, 255, 218, 0.2)',
                    },
                  }}
                >
                  <CardContent>
                    <Stack spacing={2} alignItems="center" textAlign="center">
                      <Avatar
                        src={member.image}
                        sx={{ width: 100, height: 100, mb: 2 }}
                      />
                      <Typography variant="h6" color="#ccd6f6">
                        {member.name}
                      </Typography>
                      <Typography color="#64ffda" gutterBottom>
                        {member.role}
                      </Typography>
                      <Typography color="#8892b0">
                        {member.description}
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Timeline */}
          <Typography variant="h4" color="#ccd6f6" align="center" sx={{ mb: 4 }}>
            Our Journey
          </Typography>
          <Timeline position="alternate">
            {milestones.map((milestone, index) => (
              <TimelineItem key={index}>
                <TimelineSeparator>
                  <TimelineDot sx={{ bgcolor: '#64ffda' }} />
                  {index < milestones.length - 1 && (
                    <TimelineConnector sx={{ bgcolor: '#64ffda' }} />
                  )}
                </TimelineSeparator>
                <TimelineContent>
                  <Card
                    sx={{
                      bgcolor: '#112240',
                      border: '1px solid #233554',
                      p: 2,
                    }}
                  >
                    <Typography variant="h6" color="#64ffda">
                      {milestone.year}
                    </Typography>
                    <Typography variant="subtitle1" color="#ccd6f6">
                      {milestone.title}
                    </Typography>
                    <Typography color="#8892b0">
                      {milestone.description}
                    </Typography>
                  </Card>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        </motion.div>
      </Container>
    </Box>
  );
};

export default About; 