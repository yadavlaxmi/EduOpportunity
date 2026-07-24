import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, Avatar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, IconButton, Tooltip, CircularProgress, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { MdPeople, MdSchool, MdEmojiEvents, MdDelete, MdEdit, MdCheckCircle, MdCancel } from 'react-icons/md';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalUsers: 0, students: 0, organizations: 0 });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5005/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setUsers(response.data.users);
        calculateStats(response.data.users);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (userData) => {
    const students = userData.filter(u => u.role === 'student').length;
    const orgs = userData.filter(u => u.role === 'organization').length;
    setStats({ totalUsers: userData.length, students, organizations: orgs });
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(`http://localhost:5005/api/admin/users/${userId}/status`, 
        { isActive: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        toast.success(`User status updated successfully`);
        fetchUsers();
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const StatCard = ({ title, value, icon, color }) => (
    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3 }}>
      <Card sx={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', background: `linear-gradient(135deg, #ffffff 0%, ${color}15 100%)`, border: `1px solid ${color}30` }}>
        <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
          <Box sx={{ p: 2, borderRadius: '12px', bgcolor: `${color}15`, color: color, mr: 3 }}>
            {icon}
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary" fontWeight="600" textTransform="uppercase">{title}</Typography>
            <Typography variant="h4" fontWeight="bold" color="text.primary">{value}</Typography>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><CircularProgress /></Box>;
  }

  return (
    <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" color="primary.main">Admin Dashboard</Typography>
          <Typography variant="body1" color="text.secondary">Manage users and system settings</Typography>
        </Box>
      </Box>

      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid item xs={12} md={4}>
          <StatCard title="Total Users" value={stats.totalUsers} icon={<MdPeople size={32} />} color="#3B82F6" />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard title="Students" value={stats.students} icon={<MdSchool size={32} />} color="#10B981" />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard title="Organizations" value={stats.organizations} icon={<MdEmojiEvents size={32} />} color="#8B5CF6" />
        </Grid>
      </Grid>

      <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>Recent Users</Typography>
      
      <TableContainer component={Paper} sx={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <Table sx={{ minWidth: 650 }} aria-label="users table">
          <TableHead sx={{ bgcolor: 'rgba(0,0,0,0.02)' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>User</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Role</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id} sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: 'rgba(0,0,0,0.01)' } }}>
                <TableCell component="th" scope="row">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar src={user.profilePicture || ''} sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
                      {user.fullName ? user.fullName[0].toUpperCase() : 'U'}
                    </Avatar>
                    <Typography fontWeight="500">{user.fullName}</Typography>
                  </Box>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip 
                    label={user.role} 
                    size="small"
                    sx={{ 
                      textTransform: 'capitalize',
                      bgcolor: user.role === 'admin' ? '#FEE2E2' : user.role === 'organization' ? '#EDE9FE' : '#E0F2FE',
                      color: user.role === 'admin' ? '#EF4444' : user.role === 'organization' ? '#8B5CF6' : '#0284C7',
                      fontWeight: 'bold'
                    }} 
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={user.isActive ? 'Active' : 'Inactive'} 
                    size="small"
                    icon={user.isActive ? <MdCheckCircle /> : <MdCancel />}
                    sx={{ 
                      bgcolor: user.isActive ? '#D1FAE5' : '#FEE2E2',
                      color: user.isActive ? '#10B981' : '#EF4444',
                      fontWeight: 'bold'
                    }} 
                  />
                </TableCell>
                <TableCell align="right">
                  <Tooltip title={user.isActive ? "Deactivate User" : "Activate User"}>
                    <IconButton 
                      color={user.isActive ? "error" : "success"}
                      onClick={() => handleStatusChange(user._id, !user.isActive)}
                    >
                      {user.isActive ? <MdCancel /> : <MdCheckCircle />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete User">
                    <IconButton color="error">
                      <MdDelete />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AdminDashboard;
