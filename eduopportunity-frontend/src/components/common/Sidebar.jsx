import React from 'react';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, Avatar, Divider } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { MdDashboard, MdSchool, MdEmojiEvents, MdFavorite, MdAssignment, MdPerson, MdLogout } from 'react-icons/md';

const drawerWidth = 260;

const Sidebar = ({ role = 'student' }) => {
  const location = useLocation();

  const studentLinks = [
    { text: 'Dashboard', icon: <MdDashboard size={24} />, path: '/student/dashboard' },
    { text: 'Scholarships', icon: <MdSchool size={24} />, path: '/student/scholarships' },
    { text: 'Olympiads', icon: <MdEmojiEvents size={24} />, path: '/student/olympiads' },
    { text: 'Saved', icon: <MdFavorite size={24} />, path: '/student/saved' },
    { text: 'Applied', icon: <MdAssignment size={24} />, path: '/student/applied' },
    { text: 'Profile', icon: <MdPerson size={24} />, path: '/student/profile' },
  ];

  const organizationLinks = [
    { text: 'Dashboard', icon: <MdDashboard size={24} />, path: '/organization/dashboard' },
    { text: 'My Scholarships', icon: <MdSchool size={24} />, path: '/organization/scholarships' },
    { text: 'My Olympiads', icon: <MdEmojiEvents size={24} />, path: '/organization/olympiads' },
    { text: 'Profile', icon: <MdPerson size={24} />, path: '/organization/profile' },
  ];

  const links = role === 'student' ? studentLinks : organizationLinks;

  const isActive = (path) => location.pathname === path;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          borderRight: '1px solid rgba(0,0,0,0.05)',
          background: 'var(--color-surface)',
          zIndex: (theme) => theme.zIndex.appBar - 1, // Below appbar if needed
        },
      }}
    >
      <ToolbarSpacer />
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>L</Avatar>
        <Box>
          <Typography variant="subtitle1" fontWeight="bold">Laxmi</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'capitalize' }}>{role}</Typography>
        </Box>
      </Box>
      <Divider sx={{ mx: 2, mb: 2 }} />
      <List sx={{ px: 2 }}>
        {links.map((item) => (
          <ListItem 
            button 
            key={item.text} 
            component={Link} 
            to={item.path}
            sx={{
              borderRadius: '8px',
              mb: 1,
              background: isActive(item.path) ? 'rgba(37, 99, 235, 0.1)' : 'transparent',
              color: isActive(item.path) ? 'primary.main' : 'text.primary',
              '&:hover': {
                background: 'rgba(37, 99, 235, 0.05)',
                color: 'primary.main',
                '& .MuiListItemIcon-root': { color: 'primary.main' }
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: isActive(item.path) ? 'primary.main' : 'text.secondary' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: isActive(item.path) ? 600 : 500 }} />
          </ListItem>
        ))}
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ p: 2 }}>
        <ListItem 
          button 
          sx={{
            borderRadius: '8px',
            color: 'error.main',
            '&:hover': { background: 'rgba(239, 68, 68, 0.1)' }
          }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: 'error.main' }}>
            <MdLogout size={24} />
          </ListItemIcon>
          <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 500 }} />
        </ListItem>
      </Box>
    </Drawer>
  );
};

const ToolbarSpacer = () => <Box sx={{ height: 'var(--nav-height)' }} />;

export default Sidebar;
