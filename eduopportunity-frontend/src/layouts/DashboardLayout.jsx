import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';

const DashboardLayout = ({ role = 'student' }) => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'var(--color-bg)' }}>
      <Sidebar role={role} />
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', width: { sm: `calc(100% - 260px)` } }}>
        <Navbar />
        <Box component="main" sx={{ flexGrow: 1, p: 4, overflow: 'auto' }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
