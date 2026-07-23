import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, Chip, Avatar, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import { MdSchool, MdEmojiEvents, MdFavorite, MdAssignment, MdBookmarkBorder } from 'react-icons/md';
import axios from 'axios';
import toast from 'react-hot-toast';

const StatCard = ({ title, value, icon, color, delay }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay }}>
    <Card className="hover-lift" sx={{ borderLeft: `4px solid ${color}`, height: '100%' }}>
      <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 3 }}>
        <Box>
          <Typography variant="body2" color="text.secondary" fontWeight="bold" textTransform="uppercase" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4" fontWeight="bold" color="text.primary">
            {value}
          </Typography>
        </Box>
        <Avatar sx={{ bgcolor: `${color}20`, color: color, width: 56, height: 56 }}>
          {icon}
        </Avatar>
      </CardContent>
    </Card>
  </motion.div>
);

const OpportunityCard = ({ type, title, amount, tag, delay }) => (
  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay }}>
    <Card className="hover-lift" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, pb: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Chip 
          label={tag} 
          size="small" 
          sx={{ 
            bgcolor: type === 'scholarship' ? 'primary.light' : 'warning.light', 
            color: '#fff', 
            fontWeight: 'bold',
            borderRadius: '4px'
          }} 
        />
        <IconButton size="small" color="secondary" sx={{ bgcolor: 'var(--color-bg)' }}>
          <MdBookmarkBorder />
        </IconButton>
      </Box>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ lineHeight: 1.3 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          {type === 'scholarship' ? 'Scholarship Opportunity' : 'Olympiad Exam'}
        </Typography>
        <Typography variant="h6" color="primary.main" fontWeight="bold">
          {amount}
        </Typography>
      </CardContent>
    </Card>
  </motion.div>
);

const StudentDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await axios.get('http://localhost:5005/api/dashboard/student', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
          setData(response.data.dashboard);
        }
      } catch (error) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [token]);

  if (loading) return <Typography p={4}>Loading dashboard...</Typography>;
  if (!data) return <Typography p={4}>Failed to load data</Typography>;

  return (
    <Box>
      <Box mb={4}>
        <Typography variant="h4" fontWeight="bold" color="secondary.main">
          Welcome back, {user?.fullName?.split(' ')[0]} 👋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here is an overview of your opportunities.
        </Typography>
      </Box>

      {/* Stats Section */}
      <Grid container spacing={3} mb={6}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Scholarships" value={data.totalScholarships} icon={<MdSchool size={28} />} color="#2563EB" delay={0.1} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Olympiads" value={data.totalOlympiads} icon={<MdEmojiEvents size={28} />} color="#F59E0B" delay={0.2} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Saved" value={data.savedScholarships + data.savedOlympiads} icon={<MdFavorite size={28} />} color="#EC4899" delay={0.3} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Applied" value={data.appliedScholarships + data.appliedOlympiads} icon={<MdAssignment size={28} />} color="#10B981" delay={0.4} />
        </Grid>
      </Grid>

      {/* Featured Scholarships Section */}
      <Box mb={6}>
        <Typography variant="h5" fontWeight="bold" mb={3}>
          Featured Scholarships
        </Typography>
        <Grid container spacing={3}>
          {data.featuredScholarships.length > 0 ? data.featuredScholarships.map((schol, index) => (
            <Grid item xs={12} sm={6} md={4} key={schol._id}>
              <OpportunityCard 
                type="scholarship" 
                title={schol.title} 
                amount={`₹${schol.amount}`} 
                tag={schol.scholarshipType} 
                delay={0.1 * index} 
              />
            </Grid>
          )) : (
            <Typography pl={3} color="text.secondary">No featured scholarships available.</Typography>
          )}
        </Grid>
      </Box>
      
      {/* Featured Olympiads Section */}
      <Box>
        <Typography variant="h5" fontWeight="bold" mb={3}>
          Featured Olympiads
        </Typography>
        <Grid container spacing={3}>
          {data.featuredOlympiads.length > 0 ? data.featuredOlympiads.map((olym, index) => (
            <Grid item xs={12} sm={6} md={4} key={olym._id}>
              <OpportunityCard 
                type="olympiad" 
                title={olym.title} 
                amount="View Details" 
                tag={olym.olympiadType} 
                delay={0.1 * index} 
              />
            </Grid>
          )) : (
            <Typography pl={3} color="text.secondary">No featured olympiads available.</Typography>
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export default StudentDashboard;
