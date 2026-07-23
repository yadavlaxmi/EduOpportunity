import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer, List, ListItem, ListItemText, useTheme, useMediaQuery, Avatar, Menu, MenuItem } from '@mui/material';
import { MdMenu, MdClose, MdSchool, MdPerson } from 'react-icons/md';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const navigate = useNavigate();

  // Simple state for user
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error(e);
      }
    }
  }, [location.pathname]);

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Scholarships', path: '/scholarships' },
    { label: 'Olympiads', path: '/olympiads' },
    { label: 'About', path: '/about' },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const isActive = (path) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    handleMenuClose();
    navigate('/');
  };

  return (
    <AppBar position="sticky" sx={{ background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)', color: 'text.primary', boxShadow: 'none', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
      <Toolbar sx={{ justifyContent: 'space-between', height: 'var(--nav-height)' }}>
        {/* Logo */}
        <Box component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'primary.main' }}>
          <MdSchool size={32} />
          <Typography variant="h6" sx={{ ml: 1, fontWeight: 700, letterSpacing: '-0.5px' }}>
            EduOpp
          </Typography>
        </Box>

        {/* Desktop Navigation */}
        {!isMobile && (
          <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
            {navItems.map((item) => (
              <Button
                key={item.label}
                component={Link}
                to={item.path}
                sx={{
                  color: isActive(item.path) ? 'primary.main' : 'text.primary',
                  fontWeight: isActive(item.path) ? 600 : 500,
                  '&:hover': { color: 'primary.main', background: 'transparent' }
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        )}

        {/* Auth / Profile Section */}
        {!isMobile && (
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {!user ? (
              <>
                <Button component={Link} to="/login" variant="outlined" color="primary">
                  Login
                </Button>
                <Button component={Link} to="/signup" variant="contained" color="primary">
                  Sign Up
                </Button>
              </>
            ) : (
              <>
                <Button 
                  component={Link} 
                  to={user.role === 'organization' ? '/organization/dashboard' : '/student/dashboard'} 
                  variant="outlined" 
                  color="primary"
                >
                  Dashboard
                </Button>
                <IconButton onClick={handleMenuOpen} sx={{ p: 0, ml: 1 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
                    {user.fullName ? user.fullName[0].toUpperCase() : <MdPerson />}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  PaperProps={{ sx: { mt: 1, minWidth: 150, boxShadow: 'var(--shadow-md)' } }}
                >
                  <MenuItem onClick={handleLogout} sx={{ color: 'error.main', fontWeight: 500 }}>Logout</MenuItem>
                </Menu>
              </>
            )}
          </Box>
        )}

        {/* Mobile Menu Toggle */}
        {isMobile && (
          <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle}>
            {mobileOpen ? <MdClose /> : <MdMenu />}
          </IconButton>
        )}
      </Toolbar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', pt: 2 }}>
          <List>
            {navItems.map((item) => (
              <ListItem key={item.label} component={Link} to={item.path}>
                <ListItemText primary={item.label} sx={{ color: isActive(item.path) ? 'primary.main' : 'text.primary' }} />
              </ListItem>
            ))}
            
            {/* Divider */}
            <Box sx={{ borderBottom: '1px solid #E2E8F0', my: 1 }} />
            
            {!user ? (
              <>
                <ListItem component={Link} to="/login">
                  <ListItemText primary="Login" />
                </ListItem>
                <ListItem component={Link} to="/signup">
                  <ListItemText primary="Sign Up" sx={{ color: 'primary.main', fontWeight: 'bold' }} />
                </ListItem>
              </>
            ) : (
              <>
                <ListItem component={Link} to={user.role === 'organization' ? '/organization/dashboard' : '/student/dashboard'}>
                  <ListItemText primary="Dashboard" sx={{ color: 'primary.main', fontWeight: 'bold' }} />
                </ListItem>
                <ListItem onClick={handleLogout}>
                  <ListItemText primary="Logout" sx={{ color: 'error.main' }} />
                </ListItem>
              </>
            )}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
