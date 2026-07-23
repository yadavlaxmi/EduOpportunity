import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import { MdSchool, MdEmojiEvents } from 'react-icons/md';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const OrganizationDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:5005/api/dashboard/organization', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setStats(response.data.dashboard);
      }
    } catch (error) {
      toast.error('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Typography p={4}>Loading dashboard stats...</Typography>;

  return (
    <Box>
      <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" fontWeight="bold" color="secondary.main">
            Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your opportunities and listings
          </Typography>
        </Box>
      </Box>

      {/* Stats Section */}
      <Grid container spacing={3} mb={6}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'primary.light', color: 'white', borderRadius: '16px' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" fontWeight="bold">Total Scholarships</Typography>
                <MdSchool size={36} />
              </Box>
              <Typography variant="h3" fontWeight="bold" mt={2}>
                {stats?.totalScholarships || 0}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }} mt={1}>
                {stats?.publishedScholarships || 0} Published
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'warning.light', color: 'white', borderRadius: '16px' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" fontWeight="bold">Total Olympiads</Typography>
                <MdEmojiEvents size={36} />
              </Box>
              <Typography variant="h3" fontWeight="bold" mt={2}>
                {stats?.totalOlympiads || 0}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }} mt={1}>
                {stats?.publishedOlympiads || 0} Published
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'info.main', color: 'white', borderRadius: '16px' }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold">Scholarship Status</Typography>
              <Box mt={2}>
                <Typography variant="body2">Drafts: {stats?.draftScholarships || 0}</Typography>
                <Typography variant="body2">Closed: {stats?.closedScholarships || 0}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'success.main', color: 'white', borderRadius: '16px' }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold">Olympiad Status</Typography>
              <Box mt={2}>
                <Typography variant="body2">Drafts: {stats?.draftOlympiads || 0}</Typography>
                <Typography variant="body2">Closed: {stats?.closedOlympiads || 0}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Box mt={4}>
        <Typography variant="h5" fontWeight="bold" mb={3}>Quick Actions</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Card sx={{ p: 3, borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: 'none' }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>Publish a Scholarship</Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Create a scholarship opportunity for students, set deadlines, and select application requirements.
              </Typography>
              <Button component={Link} to="/organization/scholarships" variant="contained">
                Go to Scholarships
              </Button>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card sx={{ p: 3, borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: 'none' }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>Host an Olympiad</Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Create an olympiad competition, register participants, and outline subject contents.
              </Typography>
              <Button component={Link} to="/organization/olympiads" variant="contained" color="warning">
                Go to Olympiads
              </Button>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default OrganizationDashboard;
