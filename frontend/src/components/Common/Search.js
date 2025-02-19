import React, { useState } from 'react';
import {
  Paper,
  InputBase,
  IconButton,
  Box,
  List,
  ListItem,
  ListItemText,
  Popper,
  Fade,
} from '@mui/material';
import { Search as SearchIcon, Clear } from '@mui/icons-material';

const Search = ({ onSearch, data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    setAnchorEl(event.currentTarget);

    if (value.length > 2) {
      const results = data.filter((item) =>
        item.title.toLowerCase().includes(value.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    setSearchResults([]);
    setAnchorEl(null);
  };

  const handleSelect = (item) => {
    onSearch(item);
    handleClear();
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', maxWidth: 600 }}>
      <Paper
        sx={{
          p: '2px 4px',
          display: 'flex',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <IconButton sx={{ p: '10px' }}>
          <SearchIcon />
        </IconButton>
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Search knowledge graphs..."
          value={searchTerm}
          onChange={handleSearch}
        />
        {searchTerm && (
          <IconButton sx={{ p: '10px' }} onClick={handleClear}>
            <Clear />
          </IconButton>
        )}
      </Paper>

      <Popper
        open={Boolean(searchResults.length)}
        anchorEl={anchorEl}
        placement="bottom-start"
        transition
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper sx={{ width: anchorEl?.clientWidth, mt: 1 }}>
              <List>
                {searchResults.map((result) => (
                  <ListItem
                    key={result.id}
                    button
                    onClick={() => handleSelect(result)}
                  >
                    <ListItemText
                      primary={result.title}
                      secondary={result.description}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Fade>
        )}
      </Popper>
    </Box>
  );
};

export default Search;