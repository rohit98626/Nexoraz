import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';

const UserProfile = ({ user, onUpdate }) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({ name, email }); // Call the onUpdate function with the new user data
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6">User Profile</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">
          Update Profile
        </Button>
      </form>
    </Box>
  );
};

export default UserProfile;