import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, Chip, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Divider, Pagination } from '@mui/material';
import { motion } from 'framer-motion';
import { MdBookmarkBorder } from 'react-icons/md';
import axios from 'axios';
import toast from 'react-hot-toast';

const Olympiads = () => {
  const [olympiads, setOlympiads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOlym, setSelectedOlym] = useState(null);
  const [openDetails, setOpenDetails] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchOlympiads(page);
  }, [page]);

  const fetchOlympiads = async (currentPage = 1) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5005/api/olympiads?page=${currentPage}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setOlympiads(response.data.olympiads);
        setTotalPages(response.data.totalPages || 1);
      }
    } catch (error) {
      toast.error('Failed to load olympiads');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, value) => {
    setPage(value);
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

  const handleOpenDetails = (olym) => {
    setSelectedOlym(olym);
    setOpenDetails(true);
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
                  <Box display="flex" flexDirection="column" gap={1} mt={2}>
                    <Button variant="contained" fullWidth onClick={() => handleApply(olym._id)} sx={{ textTransform: 'none', fontWeight: 'bold' }}>
                      Apply Now
                    </Button>
                    <Button variant="outlined" fullWidth onClick={() => handleOpenDetails(olym)} sx={{ textTransform: 'none' }}>
                      View Details
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        )) : (
          <Typography pl={3}>No olympiads available at the moment.</Typography>
        )}
      </Grid>

      {totalPages > 1 && (
        <Box mt={4} display="flex" justifyContent="center">
          <Pagination count={totalPages} page={page} onChange={handleChangePage} color="primary" />
        </Box>
      )}

      {/* Details Dialog */}
      <Dialog open={openDetails} onClose={() => setOpenDetails(false)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight="bold">{selectedOlym?.title}</DialogTitle>
        <DialogContent>
          <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
            <Chip label={`Subject: ${selectedOlym?.olympiadType}`} color="warning" variant="outlined" />
            <Chip label={`Level: ${selectedOlym?.educationLevel}`} color="secondary" variant="outlined" />
            <Chip label={`Fee: ₹${selectedOlym?.registrationFee || 0}`} color="success" />
          </Box>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" fontWeight="bold">Description</Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            {selectedOlym?.description}
          </Typography>
          
          <Typography variant="subtitle1" fontWeight="bold" mt={2}>Important Dates</Typography>
          <Typography variant="body2" color="text.secondary">
            Registration Starts: {selectedOlym?.registrationStartDate ? new Date(selectedOlym.registrationStartDate).toLocaleDateString() : 'N/A'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Registration Ends: {selectedOlym?.registrationEndDate ? new Date(selectedOlym.registrationEndDate).toLocaleDateString() : 'N/A'}
          </Typography>
          {selectedOlym?.examDate && (
            <Typography variant="body2" color="text.secondary">
              Exam Date: {new Date(selectedOlym.examDate).toLocaleDateString()}
            </Typography>
          )}

          {selectedOlym?.organization && (
            <>
              <Typography variant="subtitle1" fontWeight="bold" mt={2}>Hosted By</Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedOlym.organization.fullName || 'N/A'} ({selectedOlym.organization.email || 'N/A'})
              </Typography>
            </>
          )}

          <Typography variant="subtitle1" fontWeight="bold" mt={2}>Additional Details</Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                <strong>Exam Mode:</strong> {selectedOlym?.examMode || 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                <strong>Duration:</strong> {selectedOlym?.examDuration || 'N/A'}
              </Typography>
            </Grid>
            {selectedOlym?.syllabus && (
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Syllabus:</strong> {selectedOlym.syllabus}
                </Typography>
              </Grid>
            )}
            {selectedOlym?.prizes && selectedOlym.prizes.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Prizes:</strong> {selectedOlym.prizes.join(', ')}
                </Typography>
              </Grid>
            )}
            {selectedOlym?.officialWebsite && (
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Official Website:</strong> <a href={selectedOlym.officialWebsite} target="_blank" rel="noreferrer" style={{color: '#1976d2'}}>{selectedOlym.officialWebsite}</a>
                </Typography>
              </Grid>
            )}
            {selectedOlym?.applicationLink && (
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Application Link:</strong> <a href={selectedOlym.applicationLink} target="_blank" rel="noreferrer" style={{color: '#1976d2'}}>{selectedOlym.applicationLink}</a>
                </Typography>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenDetails(false)}>Close</Button>
          <Button variant="contained" color="warning" onClick={() => {
            handleApply(selectedOlym?._id);
            setOpenDetails(false);
          }}>Apply Now</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Olympiads;
