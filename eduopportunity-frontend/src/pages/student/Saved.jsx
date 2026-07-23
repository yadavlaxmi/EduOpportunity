import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, Chip, Button } from '@mui/material';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';

const Saved = () => {
  const [savedItems, setSavedItems] = useState([]);
  const [loading, setLoading] = useState(true);
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

  if (loading) return <Typography p={4}>Loading saved opportunities...</Typography>;

  return (
    <Box>
      <Box mb={4}>
        <Typography variant="h4" fontWeight="bold" color="secondary.main">
          Saved Opportunities
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Items you've bookmarked to apply later.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {savedItems.length > 0 ? savedItems.map((item, index) => {
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
                    <Button variant="outlined" fullWidth color="primary">
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
    </Box>
  );
};

export default Saved;
