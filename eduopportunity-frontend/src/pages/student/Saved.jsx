import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, Chip, Button, Dialog, DialogTitle, DialogContent, DialogActions, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';

const Saved = () => {
  const [savedItems, setSavedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [openDetails, setOpenDetails] = useState(false);
  const [filter, setFilter] = useState('All');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchSaved();
  }, []);

  const fetchSaved = async () => {
    try {
      const response = await axios.get('http://localhost:5005/api/applications/me/saved', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setSavedItems(response.data.applications);
      }
    } catch (error) {
      toast.error('Failed to load saved items');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDetails = (item) => {
    setSelectedItem(item);
    setOpenDetails(true);
  };

  const handleApply = async (id, type) => {
    try {
      const endpoint = type === 'Scholarship' 
        ? `http://localhost:5005/api/applications/scholarship/${id}/apply`
        : `http://localhost:5005/api/applications/olympiad/${id}/apply`;
      
      const response = await axios.post(endpoint, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        toast.success('Applied successfully');
        setOpenDetails(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to apply');
    }
  };

  if (loading) return <Typography p={4}>Loading saved opportunities...</Typography>;

  return (
    <Box>
      <Box mb={4} display="flex" justifyContent="space-between" alignItems="flex-start">
        <Box>
          <Typography variant="h4" fontWeight="bold" color="secondary.main">
            Saved Opportunities
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Items you've bookmarked to apply later.
          </Typography>
        </Box>
        <Box>
          <Chip 
            label="All" 
            onClick={() => setFilter('All')} 
            color={filter === 'All' ? 'primary' : 'default'} 
            variant={filter === 'All' ? 'filled' : 'outlined'} 
            sx={{ mr: 1 }}
          />
          <Chip 
            label="Scholarships" 
            onClick={() => setFilter('Scholarship')} 
            color={filter === 'Scholarship' ? 'primary' : 'default'} 
            variant={filter === 'Scholarship' ? 'filled' : 'outlined'} 
            sx={{ mr: 1 }}
          />
          <Chip 
            label="Olympiads" 
            onClick={() => setFilter('Olympiad')} 
            color={filter === 'Olympiad' ? 'primary' : 'default'} 
            variant={filter === 'Olympiad' ? 'filled' : 'outlined'} 
          />
        </Box>
      </Box>

      <Grid container spacing={3}>
        {savedItems.filter(item => filter === 'All' || item.opportunityType === filter).length > 0 ? 
          savedItems.filter(item => filter === 'All' || item.opportunityType === filter).map((item, index) => {
          const isSchol = item.opportunityType === 'Scholarship';
          const details = isSchol ? item.scholarship : item.olympiad;
          
          if (!details) return null;

          return (
            <Grid item xs={12} sm={6} md={4} key={item._id}>
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: 0.1 * index }}>
                <Card className="hover-lift" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ p: 2, pb: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Chip 
                      label={isSchol ? 'Scholarship' : 'Olympiad'} 
                      size="small" 
                      sx={{ bgcolor: isSchol ? 'primary.light' : 'warning.light', color: '#fff', fontWeight: 'bold', borderRadius: '4px' }} 
                    />
                  </Box>
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ lineHeight: 1.3 }}>
                      {details.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={3} sx={{ flexGrow: 1 }}>
                      {details.description ? details.description.substring(0, 100) + '...' : 'No description provided.'}
                    </Typography>
                    <Button variant="outlined" fullWidth color="primary" onClick={() => handleOpenDetails(item)}>
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          );
        }) : (
          <Typography pl={3}>You haven't saved any opportunities yet.</Typography>
        )}
      </Grid>

      {/* Details Dialog */}
      {selectedItem && (
        <Dialog open={openDetails} onClose={() => setOpenDetails(false)} maxWidth="sm" fullWidth>
          <DialogTitle fontWeight="bold">
            {selectedItem.opportunityType === 'Scholarship' ? selectedItem.scholarship?.title : selectedItem.olympiad?.title}
          </DialogTitle>
          <DialogContent>
            {selectedItem.opportunityType === 'Scholarship' ? (
              <>
                <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                  <Chip label={`Type: ${selectedItem.scholarship?.scholarshipType}`} color="primary" variant="outlined" />
                  <Chip label={`Level: ${selectedItem.scholarship?.educationLevel}`} color="secondary" variant="outlined" />
                  <Chip label={`Amount: ₹${selectedItem.scholarship?.amount}`} color="success" />
                </Box>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" fontWeight="bold">Description</Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {selectedItem.scholarship?.description}
                </Typography>
                <Typography variant="subtitle1" fontWeight="bold" mt={2}>Additional Details</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Application Fee:</strong> ₹{selectedItem.scholarship?.applicationFee || 0}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Mode:</strong> {selectedItem.scholarship?.applicationMode || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Min Percentage:</strong> {selectedItem.scholarship?.minimumPercentage ? `${selectedItem.scholarship.minimumPercentage}%` : 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Total Seats:</strong> {selectedItem.scholarship?.totalSeats || 'N/A'}
                    </Typography>
                  </Grid>
                  {selectedItem.scholarship?.officialWebsite && (
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Official Website:</strong> <a href={selectedItem.scholarship.officialWebsite} target="_blank" rel="noreferrer" style={{color: '#1976d2'}}>{selectedItem.scholarship.officialWebsite}</a>
                      </Typography>
                    </Grid>
                  )}
                  {selectedItem.scholarship?.applicationLink && (
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Application Link:</strong> <a href={selectedItem.scholarship.applicationLink} target="_blank" rel="noreferrer" style={{color: '#1976d2'}}>{selectedItem.scholarship.applicationLink}</a>
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </>
            ) : (
              <>
                <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                  <Chip label={`Type: ${selectedItem.olympiad?.olympiadType}`} color="warning" variant="outlined" />
                  <Chip label={`Level: ${selectedItem.olympiad?.educationLevel}`} color="secondary" variant="outlined" />
                </Box>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" fontWeight="bold">Description</Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {selectedItem.olympiad?.description}
                </Typography>
                <Typography variant="subtitle1" fontWeight="bold" mt={2}>Additional Details</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Exam Mode:</strong> {selectedItem.olympiad?.examMode || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Duration:</strong> {selectedItem.olympiad?.examDuration || 'N/A'}
                    </Typography>
                  </Grid>
                  {selectedItem.olympiad?.syllabus && (
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Syllabus:</strong> {selectedItem.olympiad.syllabus}
                      </Typography>
                    </Grid>
                  )}
                  {selectedItem.olympiad?.prizes && selectedItem.olympiad.prizes.length > 0 && (
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Prizes:</strong> {selectedItem.olympiad.prizes.join(', ')}
                      </Typography>
                    </Grid>
                  )}
                  {selectedItem.olympiad?.officialWebsite && (
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Official Website:</strong> <a href={selectedItem.olympiad.officialWebsite} target="_blank" rel="noreferrer" style={{color: '#1976d2'}}>{selectedItem.olympiad.officialWebsite}</a>
                      </Typography>
                    </Grid>
                  )}
                  {selectedItem.olympiad?.applicationLink && (
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Application Link:</strong> <a href={selectedItem.olympiad.applicationLink} target="_blank" rel="noreferrer" style={{color: '#1976d2'}}>{selectedItem.olympiad.applicationLink}</a>
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpenDetails(false)}>Close</Button>
            <Button variant="contained" onClick={() => handleApply(
              selectedItem.opportunityType === 'Scholarship' ? selectedItem.scholarship?._id : selectedItem.olympiad?._id,
              selectedItem.opportunityType
            )}>
              Apply Now
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default Saved;
