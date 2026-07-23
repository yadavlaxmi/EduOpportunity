import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, Chip, Button, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import { MdBookmarkBorder, MdBookmark } from 'react-icons/md';
import axios from 'axios';
import toast from 'react-hot-toast';

const Scholarships = () => {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchScholarships();
  }, []);

  const fetchScholarships = async () => {
    try {
      // Assuming GET /api/scholarships is a public or protected route returning list
      const response = await axios.get('http://localhost:5005/api/scholarships', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setScholarships(response.data.scholarships);
      }
    } catch (error) {
      toast.error('Failed to load scholarships');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (id) => {
    try {
      const response = await axios.post(`http://localhost:5005/api/applications/scholarship/${id}/save`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        toast.success('Scholarship saved successfully');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save');
    }
  };

  const handleApply = async (id) => {
    try {
      const response = await axios.post(`http://localhost:5005/api/applications/scholarship/${id}/apply`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        toast.success('Applied successfully');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to apply');
    }
  };

  if (loading) return <Typography p={4}>Loading scholarships...</Typography>;

  return (
    <Box>
      <Box mb={4}>
        <Typography variant="h4" fontWeight="bold" color="secondary.main">
          Scholarships
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Browse and apply for the best scholarships.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {scholarships.length > 0 ? scholarships.map((schol, index) => (
          <Grid item xs={12} sm={6} md={4} key={schol._id}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: 0.1 * index }}>
              <Card className="hover-lift" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ p: 2, pb: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Chip 
                    label={schol.scholarshipType || 'General'} 
                    size="small" 
                    sx={{ bgcolor: 'primary.light', color: '#fff', fontWeight: 'bold', borderRadius: '4px' }} 
                  />
                  <IconButton size="small" color="secondary" onClick={() => handleSave(schol._id)}>
                    <MdBookmarkBorder />
                  </IconButton>
                </Box>
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ lineHeight: 1.3 }}>
                    {schol.title}
                  </Typography>
                  <Typography variant="h6" color="primary.main" fontWeight="bold" mb={2}>
                    ₹{schol.amount}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={3} sx={{ flexGrow: 1 }}>
                    {schol.description ? schol.description.substring(0, 100) + '...' : 'No description provided.'}
                  </Typography>
                  <Button variant="contained" fullWidth onClick={() => handleApply(schol._id)}>
                    Apply Now
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        )) : (
          <Typography pl={3}>No scholarships available at the moment.</Typography>
        )}
      </Grid>
    </Box>
  );
};

export default Scholarships;
