import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, Chip, Button, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import { MdBookmarkBorder, MdBookmark } from 'react-icons/md';
import axios from 'axios';
import toast from 'react-hot-toast';

const Olympiads = () => {
  const [olympiads, setOlympiads] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchOlympiads();
  }, []);

  const fetchOlympiads = async () => {
    try {
      const response = await axios.get('http://localhost:5005/api/olympiads', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setOlympiads(response.data.olympiads);
      }
    } catch (error) {
      toast.error('Failed to load olympiads');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (id) => {
    try {
      const response = await axios.post(`http://localhost:5005/api/applications/olympiad/${id}/save`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        toast.success('Olympiad saved successfully');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save');
    }
  };

  const handleApply = async (id) => {
    try {
      const response = await axios.post(`http://localhost:5005/api/applications/olympiad/${id}/apply`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        toast.success('Applied successfully');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to apply');
    }
  };

  if (loading) return <Typography p={4}>Loading olympiads...</Typography>;

  return (
    <Box>
      <Box mb={4}>
        <Typography variant="h4" fontWeight="bold" color="secondary.main">
          Olympiads
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Participate in olympiads and showcase your talent.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {olympiads.length > 0 ? olympiads.map((olym, index) => (
          <Grid item xs={12} sm={6} md={4} key={olym._id}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: 0.1 * index }}>
              <Card className="hover-lift" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ p: 2, pb: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Chip 
                    label={olym.olympiadType || 'General'} 
                    size="small" 
                    sx={{ bgcolor: 'warning.light', color: '#fff', fontWeight: 'bold', borderRadius: '4px' }} 
                  />
                  <IconButton size="small" color="secondary" onClick={() => handleSave(olym._id)}>
                    <MdBookmarkBorder />
                  </IconButton>
                </Box>
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ lineHeight: 1.3 }}>
                    {olym.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={3} sx={{ flexGrow: 1 }}>
                    {olym.description ? olym.description.substring(0, 100) + '...' : 'No description provided.'}
                  </Typography>
                  <Button variant="contained" fullWidth onClick={() => handleApply(olym._id)}>
                    Apply Now
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        )) : (
          <Typography pl={3}>No olympiads available at the moment.</Typography>
        )}
      </Grid>
    </Box>
  );
};

export default Olympiads;
