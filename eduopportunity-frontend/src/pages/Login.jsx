import React, { useState } from 'react';
import { Box, Card, Typography, TextField, Button, Container } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5005/api/auth/login', { email, password });
      if (response.data.success) {
        toast.success('Login successful!');
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        const role = response.data.user.role;
        const profileCompleted = response.data.user.profileCompleted;
        if (role === 'organization') {
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
      toast.error(error.response?.data?.message || 'Login failed');
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
      toast.error(error.response?.data?.message || 'Google login failed');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 10 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card sx={{ p: 4, borderRadius: '16px', boxShadow: 'var(--shadow-lg)' }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" fontWeight="bold" color="secondary.main" gutterBottom>
              Welcome Back
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Sign in to continue to EduOpp
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleLogin} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
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
              label="Password" 
              variant="outlined" 
              fullWidth 
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Link to="/forgot-password" style={{ color: 'var(--color-primary)', fontSize: '0.875rem', fontWeight: 500 }}>
                Forgot Password?
              </Link>
            </Box>

            <Button type="submit" variant="contained" color="primary" size="large" fullWidth sx={{ py: 1.5, fontWeight: 'bold' }} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
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
                toast.error('Google Login Failed');
              }}
            />
          </Box>

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{' '}
              <Link to="/signup" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
                Sign up here
              </Link>
            </Typography>
          </Box>
        </Card>
      </motion.div>
    </Container>
  );
};

export default Login;