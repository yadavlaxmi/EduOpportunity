import React from 'react';
import { Box, Container, Grid, Typography, IconButton, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';
import { FaTwitter, FaLinkedin, FaGithub, FaInstagram } from 'react-icons/fa';
import { MdSchool } from 'react-icons/md';

const Footer = () => {
  return (
    <Box component="footer" sx={{ bgcolor: 'secondary.main', color: 'secondary.contrastText', py: 6, mt: 'auto' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box display="flex" alignItems="center" mb={2}>
              <MdSchool size={32} color="#2563EB" />
              <Typography variant="h6" sx={{ ml: 1, fontWeight: 700 }}>
                EduOpp
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: 'secondary.light', mb: 2, maxWidth: 300, lineHeight: 1.6, color: '#94A3B8' }}>
              Your gateway to the best scholarships and olympiads. Discover, apply, and achieve your educational dreams with ease.
            </Typography>
            <Box display="flex" gap={1}>
              <IconButton size="small" sx={{ color: '#94A3B8', '&:hover': { color: 'primary.light' } }}>
                <FaTwitter />
              </IconButton>
              <IconButton size="small" sx={{ color: '#94A3B8', '&:hover': { color: 'primary.light' } }}>
                <FaLinkedin />
              </IconButton>
              <IconButton size="small" sx={{ color: '#94A3B8', '&:hover': { color: 'primary.light' } }}>
                <FaGithub />
              </IconButton>
              <IconButton size="small" sx={{ color: '#94A3B8', '&:hover': { color: 'primary.light' } }}>
                <FaInstagram />
              </IconButton>
            </Box>
          </Grid>
          
          <Grid item xs={6} md={2}>
            <Typography variant="subtitle1" fontWeight="bold" mb={2}>
              Platform
            </Typography>
            <Box display="flex" flexDirection="column" gap={1}>
              <MuiLink component={Link} to="/scholarships" underline="hover" sx={{ color: '#94A3B8', '&:hover': { color: '#fff' } }}>Scholarships</MuiLink>
              <MuiLink component={Link} to="/olympiads" underline="hover" sx={{ color: '#94A3B8', '&:hover': { color: '#fff' } }}>Olympiads</MuiLink>
              <MuiLink component={Link} to="/organizations" underline="hover" sx={{ color: '#94A3B8', '&:hover': { color: '#fff' } }}>For Organizations</MuiLink>
            </Box>
          </Grid>

          <Grid item xs={6} md={2}>
            <Typography variant="subtitle1" fontWeight="bold" mb={2}>
              Company
            </Typography>
            <Box display="flex" flexDirection="column" gap={1}>
              <MuiLink component={Link} to="/about" underline="hover" sx={{ color: '#94A3B8', '&:hover': { color: '#fff' } }}>About Us</MuiLink>
              <MuiLink component={Link} to="/contact" underline="hover" sx={{ color: '#94A3B8', '&:hover': { color: '#fff' } }}>Contact</MuiLink>
              <MuiLink component={Link} to="/careers" underline="hover" sx={{ color: '#94A3B8', '&:hover': { color: '#fff' } }}>Careers</MuiLink>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" fontWeight="bold" mb={2}>
              Stay Updated
            </Typography>
            <Typography variant="body2" sx={{ color: '#94A3B8', mb: 2 }}>
              Subscribe to our newsletter to get the latest opportunities directly in your inbox.
            </Typography>
            {/* Newsletter input placeholder */}
            <Box display="flex">
              <input 
                type="email" 
                placeholder="Enter your email" 
                style={{ 
                  padding: '10px 16px', 
                  borderRadius: '8px 0 0 8px', 
                  border: 'none',
                  outline: 'none',
                  flexGrow: 1,
                  background: '#1E293B',
                  color: '#fff'
                }} 
              />
              <button 
                style={{ 
                  padding: '10px 20px', 
                  borderRadius: '0 8px 8px 0', 
                  background: '#2563EB', 
                  color: '#fff',
                  fontWeight: 'bold'
                }}
              >
                Subscribe
              </button>
            </Box>
          </Grid>
        </Grid>
        
        <Box mt={6} pt={3} borderTop="1px solid #1E293B" display="flex" justifyContent="space-between" flexWrap="wrap">
          <Typography variant="body2" sx={{ color: '#94A3B8' }}>
            &copy; {new Date().getFullYear()} EduOpp. All rights reserved.
          </Typography>
          <Box display="flex" gap={3}>
            <MuiLink component={Link} to="/privacy" underline="hover" sx={{ color: '#94A3B8', fontSize: '0.875rem' }}>Privacy Policy</MuiLink>
            <MuiLink component={Link} to="/terms" underline="hover" sx={{ color: '#94A3B8', fontSize: '0.875rem' }}>Terms of Service</MuiLink>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
