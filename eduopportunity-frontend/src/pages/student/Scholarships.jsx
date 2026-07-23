import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, Chip, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import { MdBookmarkBorder } from 'react-icons/md';
import axios from 'axios';
import toast from 'react-hot-toast';

const Scholarships = () => {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSchol, setSelectedSchol] = useState(null);
  const [openDetails, setOpenDetails] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchScholarships();
  }, []);

  const fetchScholarships = async () => {
    try {
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

  const handleOpenDetails = (schol) => {
    setSelectedSchol(schol);
    setOpenDetails(true);
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
                  <Box display="flex" flexDirection="column" gap={1} mt={2}>
                    <Button variant="contained" fullWidth onClick={() => handleApply(schol._id)} sx={{ textTransform: 'none', fontWeight: 'bold' }}>
                      Apply Now
                    </Button>
                    <Button variant="outlined" fullWidth onClick={() => handleOpenDetails(schol)} sx={{ textTransform: 'none' }}>
                      View Details
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        )) : (
          <Typography pl={3}>No scholarships available at the moment.</Typography>
        )}
      </Grid>

      {/* Details Dialog */}
      <Dialog open={openDetails} onClose={() => setOpenDetails(false)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight="bold">{selectedSchol?.title}</DialogTitle>
        <DialogContent>
          <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
            <Chip label={`Type: ${selectedSchol?.scholarshipType}`} color="primary" variant="outlined" />
            <Chip label={`Level: ${selectedSchol?.educationLevel}`} color="secondary" variant="outlined" />
            <Chip label={`Amount: ₹${selectedSchol?.amount}`} color="success" />
          </Box>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" fontWeight="bold">Description</Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            {selectedSchol?.description}
          </Typography>
          
          <Typography variant="subtitle1" fontWeight="bold" mt={2}>Important Dates</Typography>
          <Typography variant="body2" color="text.secondary">
            Start Date: {selectedSchol?.startDate ? new Date(selectedSchol.startDate).toLocaleDateString() : 'N/A'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Last Date to Apply: {selectedSchol?.lastDate ? new Date(selectedSchol.lastDate).toLocaleDateString() : 'N/A'}
          </Typography>

          {selectedSchol?.organization && (
            <>
              <Typography variant="subtitle1" fontWeight="bold" mt={2}>Offered By</Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedSchol.organization.fullName || 'N/A'} ({selectedSchol.organization.email || 'N/A'})
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenDetails(false)}>Close</Button>
          <Button variant="contained" onClick={() => {
            handleApply(selectedSchol?._id);
            setOpenDetails(false);
          }}>Apply Now</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Scholarships;
