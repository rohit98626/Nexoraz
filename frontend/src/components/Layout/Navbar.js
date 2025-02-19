import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Box, Button, Container } from '@mui/material';
import { motion, useScroll } from 'framer-motion';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';

const StyledAppBar = styled(motion(AppBar))`
  background: rgba(10, 25, 47, 0.85);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(100, 255, 218, 0.1);
`;

const NavButton = styled(Button)`
  color: #64ffda;
  margin: 0 1rem;
  font-size: 1rem;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    width: 0;
    height: 2px;
    bottom: 0;
    left: 0;
    background-color: #64ffda;
    transition: width 0.3s ease;
  }

  &:hover::after {
    width: 100%;
  }
`;

const Logo = styled(motion.div)`
  font-size: 1.5rem;
  font-weight: 700;
  color: #64ffda;
  cursor: pointer;
`;

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    return scrollY.onChange(() => setIsScrolled(scrollY.get() > 50));
  }, [scrollY]);

  return (
    <StyledAppBar
      position="fixed"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      elevation={isScrolled ? 24 : 0}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Logo
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            component={Link}
            to="/"
          >
            Knowledge Graph
          </Logo>
          
          <Box>
            {['Home', 'Features', 'About', 'Contact'].map((item) => (
              <NavButton
                key={item}
                component={motion.button}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
                {item}
              </NavButton>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </StyledAppBar>
  );
};

export default Navbar;