import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Navbar from './components/Layout/Navbar';
import Home from './components/Home/index';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import Footer from './components/Layout/Footer';
import InteractiveVisualization from './components/Documentation/InteractiveVisualization';
import RealTimeCollaboration from './components/Documentation/RealTimeCollaboration';
import AIAnalytics from './components/Documentation/AIAnalytics';
import { Provider } from 'react-redux';
import store from './redux/store';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#64ffda',
    },
    secondary: {
      main: '#00bcd4',
    },
    background: {
      default: '#0a192f',
      paper: '#112240',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            minHeight: '100vh',
            bgcolor: '#0a192f'
          }}>
            <Navbar />
            <Box component="main" sx={{ 
              flexGrow: 1,
              marginTop: '64px',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/docs/visualization" element={<InteractiveVisualization />} />
                <Route path="/docs/collaboration" element={<RealTimeCollaboration />} />
                <Route path="/docs/analytics" element={<AIAnalytics />} />
                <Route path="/dashboard" element={ <Dashboard />} />
              </Routes>
            </Box>
            <Footer />
          </Box>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;