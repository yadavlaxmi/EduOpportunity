import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, Chip, Button } from '@mui/material';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';

const Applied = () => {
  const [appliedItems, setAppliedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchApplied();
  }, []);

  const fetchApplied = async () => {
    try {
      const response = await axios.get('http://localhost:5005/api/applications/me/applied', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setAppliedItems(response.data.applications);
      }
    } catch (error) {
      toast.error('Failed to load applied items');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Typography p={4}>Loading applied opportunities...</Typography>;

  return (
    <Box>
      <Box mb={4}>
        <Typography variant="h4" fontWeight="bold" color="secondary.main">
          My Applications
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track the status of your scholarship and olympiad applications.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {appliedItems.length > 0 ? appliedItems.map((item, index) => {
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
                    <Chip 
                      label="Applied" 
                      size="small" 
                      sx={{ bgcolor: 'success.light', color: '#fff', fontWeight: 'bold', borderRadius: '4px' }} 
                    />
                  </Box>
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ lineHeight: 1.3 }}>
                      {details.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={1}>
                      Applied on: {new Date(item.createdAt).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={3} sx={{ flexGrow: 1 }}>
                      Status: {item.status}
                    </Typography>
                    <Button variant="outlined" fullWidth color="success">
                      Track Status
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          );
        }) : (
          <Typography pl={3}>You haven't applied to any opportunities yet.</Typography>
        )}
      </Grid>
    </Box>
  );
};

export default Applied;
