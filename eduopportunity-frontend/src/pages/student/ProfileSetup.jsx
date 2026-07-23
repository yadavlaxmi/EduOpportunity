import React, { useState } from 'react';
import { Box, Card, Typography, TextField, Button, MenuItem, Grid, Stepper, Step, StepLabel, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const steps = ['Personal Information', 'Education Details', 'Additional Details'];

const ProfileSetup = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    phone: '',
    dob: '',
    gender: 'Other',
    state: '',
    city: '',
    pincode: '',
    educationLevel: 'School',
    schoolName: '',
    collegeName: '',
    currentClass: '',
    degree: '',
    graduationYear: '',
    board: '',
    tenthPercentage: '',
    twelfthPercentage: '',
    cgpa: '',
    category: 'General',
    annualIncome: '',
    isMinority: false,
    isDisabled: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleNext = () => {
    // Basic validation can go here
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      // Format data properly for API
      const payload = {
        ...formData,
        annualIncome: Number(formData.annualIncome) || 0,
        graduationYear: formData.graduationYear ? Number(formData.graduationYear) : null,
        tenthPercentage: formData.tenthPercentage ? Number(formData.tenthPercentage) : null,
        twelfthPercentage: formData.twelfthPercentage ? Number(formData.twelfthPercentage) : null,
        cgpa: formData.cgpa ? Number(formData.cgpa) : null,
      };

      const response = await axios.post('http://localhost:5005/api/student/profile', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        toast.success('Profile completed successfully!');
        // Update user state in localStorage to reflect profile completion
        const user = JSON.parse(localStorage.getItem('user'));
        user.profileCompleted = true;
        localStorage.setItem('user', JSON.stringify(user));
        
        navigate('/student/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to complete profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Card sx={{ p: 4, borderRadius: '16px', boxShadow: 'var(--shadow-md)' }}>
        <Box textAlign="center" mb={4}>
          <Typography variant="h4" fontWeight="bold" color="primary.main">Complete Your Profile</Typography>
          <Typography variant="body1" color="text.secondary">We need a few more details to set up your dashboard</Typography>
        </Box>

        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 6 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <form onSubmit={activeStep === steps.length - 1 ? handleSubmit : (e) => e.preventDefault()}>
          
          {/* Step 1: Personal Info */}
          {activeStep === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} required />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth label="Middle Name" name="middleName" value={formData.middleName} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Date of Birth" name="dob" type="date" InputLabelProps={{ shrink: true }} value={formData.dob} onChange={handleChange} required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField select fullWidth label="Gender" name="gender" value={formData.gender} onChange={handleChange}>
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="City" name="city" value={formData.city} onChange={handleChange} required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="State" name="state" value={formData.state} onChange={handleChange} required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Pincode" name="pincode" value={formData.pincode} onChange={handleChange} required />
              </Grid>
            </Grid>
          )}

          {/* Step 2: Education Info */}
          {activeStep === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField select fullWidth label="Education Level" name="educationLevel" value={formData.educationLevel} onChange={handleChange}>
                  <MenuItem value="School">School</MenuItem>
                  <MenuItem value="Diploma">Diploma</MenuItem>
                  <MenuItem value="UG">Undergraduate (UG)</MenuItem>
                  <MenuItem value="PG">Postgraduate (PG)</MenuItem>
                </TextField>
              </Grid>

              {formData.educationLevel === 'School' ? (
                <>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="School Name" name="schoolName" value={formData.schoolName} onChange={handleChange} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Current Class (e.g., 10th, 12th)" name="currentClass" value={formData.currentClass} onChange={handleChange} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Board (e.g., CBSE, State)" name="board" value={formData.board} onChange={handleChange} />
                  </Grid>
                </>
              ) : (
                <>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="College/University Name" name="collegeName" value={formData.collegeName} onChange={handleChange} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Degree (e.g., B.Tech, B.Sc)" name="degree" value={formData.degree} onChange={handleChange} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Graduation Year" name="graduationYear" type="number" value={formData.graduationYear} onChange={handleChange} />
                  </Grid>
                </>
              )}
            </Grid>
          )}

          {/* Step 3: Additional Details */}
          {activeStep === 2 && (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth label="10th Percentage" name="tenthPercentage" type="number" value={formData.tenthPercentage} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth label="12th Percentage" name="twelfthPercentage" type="number" value={formData.twelfthPercentage} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth label="Current CGPA" name="cgpa" type="number" value={formData.cgpa} onChange={handleChange} />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField select fullWidth label="Category" name="category" value={formData.category} onChange={handleChange}>
                  <MenuItem value="General">General</MenuItem>
                  <MenuItem value="OBC">OBC</MenuItem>
                  <MenuItem value="SC">SC</MenuItem>
                  <MenuItem value="ST">ST</MenuItem>
                  <MenuItem value="EWS">EWS</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Family Annual Income (₹)" name="annualIncome" type="number" value={formData.annualIncome} onChange={handleChange} required />
              </Grid>
            </Grid>
          )}

          {/* Navigation Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button disabled={activeStep === 0} onClick={handleBack} variant="outlined" sx={{ px: 4 }}>
              Back
            </Button>
            {activeStep === steps.length - 1 ? (
              <Button type="submit" variant="contained" color="primary" sx={{ px: 4 }} disabled={loading}>
                {loading ? 'Submitting...' : 'Complete Profile'}
              </Button>
            ) : (
              <Button variant="contained" onClick={handleNext} sx={{ px: 4 }}>
                Next
              </Button>
            )}
          </Box>

        </form>
      </Card>
    </Container>
  );
};

export default ProfileSetup;
