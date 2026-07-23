import React, { useState } from 'react';
import { Box, Card, Typography, TextField, Button, MenuItem, Container } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';

const Signup = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const fullName = `${firstName} ${lastName}`.trim();

    try {
      const response = await axios.post('http://localhost:5005/api/auth/signup', { 
        fullName, 
        email, 
        password, 
        role 
      });
      
      if (response.data.success) {
        toast.success('Account created successfully! Please login.');
        navigate('/login');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await axios.post('http://localhost:5005/api/auth/google-login', { token: credentialResponse.credential });
      if (response.data.success) {
        toast.success('Google login successful!');
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        const userRole = response.data.user.role;
        const profileCompleted = response.data.user.profileCompleted;
        if (userRole === 'organization') {
          if (profileCompleted) {
            navigate('/organization/dashboard');
          } else {
            navigate('/organization/profile-setup');
          }
        } else {
          if (profileCompleted) {
            navigate('/student/dashboard');
          } else {
            navigate('/student/profile-setup');
          }
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Google signup failed');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 10 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card sx={{ p: 4, borderRadius: '16px', boxShadow: 'var(--shadow-lg)' }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" fontWeight="bold" color="secondary.main" gutterBottom>
              Create an Account
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Join EduOpp to discover the best opportunities
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSignup} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField 
                label="First Name" 
                variant="outlined" 
                fullWidth 
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <TextField 
                label="Last Name" 
                variant="outlined" 
                fullWidth 
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </Box>
            
            <TextField 
              label="Email Address" 
              variant="outlined" 
              fullWidth 
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <TextField
              select
              label="I am a..."
              value={role}
              onChange={(e) => setRole(e.target.value)}
              fullWidth
            >
              <MenuItem value="student">Student</MenuItem>
              <MenuItem value="organization">Organization</MenuItem>
            </TextField>
            
            <TextField 
              label="Password" 
              variant="outlined" 
              fullWidth 
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit" variant="contained" color="primary" size="large" fullWidth sx={{ py: 1.5, fontWeight: 'bold', mt: 1 }} disabled={loading}>
              {loading ? 'Creating account...' : 'Sign Up'}
            </Button>
          </Box>

          <Box sx={{ my: 4, display: 'flex', alignItems: 'center', '&::before, &::after': { content: '""', flex: 1, borderBottom: '1px solid #E2E8F0' } }}>
            <Typography variant="body2" sx={{ px: 2, color: 'text.secondary' }}>
              OR
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <GoogleLogin 
              onSuccess={handleGoogleSuccess}
              onError={() => {
                toast.error('Google Signup Failed');
              }}
            />
          </Box>

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
                Sign in here
              </Link>
            </Typography>
          </Box>
        </Card>
      </motion.div>
    </Container>
  );
};

export default Signup;