import React, { useState, useEffect } from 'react';
import { Box, Card, Typography, TextField, Button, Grid, Avatar, Divider, Container, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { MdPerson, MdEdit, MdSave, MdWarning, MdClose } from 'react-icons/md';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({});
  const [openDeactivateDialog, setOpenDeactivateDialog] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('http://localhost:5005/api/student/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setProfileData(response.data.profile);
        setFormData(response.data.profile);
      }
    } catch (error) {
      toast.error('Failed to load profile details');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        annualIncome: Number(formData.annualIncome) || 0,
        graduationYear: formData.graduationYear ? Number(formData.graduationYear) : null,
        tenthPercentage: formData.tenthPercentage ? Number(formData.tenthPercentage) : null,
        twelfthPercentage: formData.twelfthPercentage ? Number(formData.twelfthPercentage) : null,
        cgpa: formData.cgpa ? Number(formData.cgpa) : null,
      };

      const response = await axios.put('http://localhost:5005/api/student/profile', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        toast.success('Profile updated successfully');
        setProfileData(response.data.profile);
        setIsEditing(false);
      }
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleDeactivate = async () => {
    try {
      const response = await axios.patch('http://localhost:5005/api/users/deactivate', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        toast.success('Account deactivated successfully');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to deactivate account');
    }
  };

  if (loading) {
    return <Typography sx={{ p: 4 }}>Loading profile...</Typography>;
  }

  if (!profileData) {
    return <Typography sx={{ p: 4 }}>Profile not found. Please complete your setup.</Typography>;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" fontWeight="bold" color="secondary.main">
          My Profile
        </Typography>
        <Button 
          variant={isEditing ? "outlined" : "contained"} 
          color="primary" 
          startIcon={isEditing ? <MdClose /> : <MdEdit />} 
          onClick={() => {
            if(isEditing) setFormData(profileData); // reset changes
            setIsEditing(!isEditing);
            console.log("pencil icon clicked");
            alert("pencil icon clicked");
            setIsEditing(true);
          }}
          sx={{ borderRadius: 2 }}
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </Button>
      </Box>

      <Grid container spacing={4}>
        {/* Left Column: Avatar and User Basics */}
        <Grid item xs={12} md={4}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <Card sx={{ p: 4, textAlign: 'center', borderRadius: '16px', boxShadow: 'var(--shadow-sm)' }}>
              <Avatar 
                src={user?.profilePicture}
                sx={{ width: 120, height: 120, mx: 'auto', mb: 2, bgcolor: 'primary.main', fontSize: '3rem' }}
              >
                {user?.fullName?.[0]?.toUpperCase()}
              </Avatar>
              <Typography variant="h5" fontWeight="bold">{user?.fullName}</Typography>
              <Typography variant="body1" color="text.secondary" mb={3}>{user?.email}</Typography>
              <Box display="flex" gap={1} justifyContent="center" mb={2}>
                <Typography variant="body2" sx={{ bgcolor: 'primary.light', color: 'white', px: 1.5, py: 0.5, borderRadius: 1, fontWeight: 'bold' }}>
                  Student
                </Typography>
                {profileData.educationLevel && (
                  <Typography variant="body2" sx={{ bgcolor: 'secondary.light', color: 'white', px: 1.5, py: 0.5, borderRadius: 1 }}>
                    {profileData.educationLevel}
                  </Typography>
                )}
              </Box>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card sx={{ p: 3, mt: 3, borderRadius: '16px', boxShadow: 'var(--shadow-sm)', border: '1px solid #fee2e2' }}>
              <Typography variant="h6" fontWeight="bold" color="error.main" mb={1} display="flex" alignItems="center" gap={1}>
                <MdWarning /> Danger Zone
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Once you deactivate your account, you will lose access to all your saved scholarships and applications.
              </Typography>
              <Button variant="outlined" color="error" fullWidth onClick={() => setOpenDeactivateDialog(true)}>
                Deactivate Account
              </Button>
            </Card>
          </motion.div>
        </Grid>

        {/* Right Column: Profile Details Form */}
        <Grid item xs={12} md={8}>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <Card sx={{ p: 4, borderRadius: '16px', boxShadow: 'var(--shadow-md)' }}>
              <form onSubmit={handleUpdate}>
                
                {/* Personal Information */}
                <Typography variant="h6" fontWeight="bold" mb={3} color="primary.main">Personal Information</Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={4}>
                    <TextField fullWidth label="First Name" name="firstName" value={formData.firstName || ''} onChange={handleChange} disabled={!isEditing} />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField fullWidth label="Middle Name" name="middleName" value={formData.middleName || ''} onChange={handleChange} disabled={!isEditing} />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField fullWidth label="Last Name" name="lastName" value={formData.lastName || ''} onChange={handleChange} disabled={!isEditing} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Phone" name="phone" value={formData.phone || ''} onChange={handleChange} disabled={!isEditing} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Gender" name="gender" value={formData.gender || ''} onChange={handleChange} disabled={!isEditing} />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField fullWidth label="City" name="city" value={formData.city || ''} onChange={handleChange} disabled={!isEditing} />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField fullWidth label="State" name="state" value={formData.state || ''} onChange={handleChange} disabled={!isEditing} />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField fullWidth label="Pincode" name="pincode" value={formData.pincode || ''} onChange={handleChange} disabled={!isEditing} />
                  </Grid>
                </Grid>

                <Divider sx={{ my: 4 }} />

                {/* Education Details */}
                <Typography variant="h6" fontWeight="bold" mb={3} color="primary.main">Education Details</Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Education Level" name="educationLevel" value={formData.educationLevel || ''} onChange={handleChange} disabled={!isEditing} />
                  </Grid>
                  {formData.educationLevel === 'School' ? (
                    <>
                      <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="School Name" name="schoolName" value={formData.schoolName || ''} onChange={handleChange} disabled={!isEditing} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Current Class" name="currentClass" value={formData.currentClass || ''} onChange={handleChange} disabled={!isEditing} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Board" name="board" value={formData.board || ''} onChange={handleChange} disabled={!isEditing} />
                      </Grid>
                    </>
                  ) : (
                    <>
                      <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="College/University Name" name="collegeName" value={formData.collegeName || ''} onChange={handleChange} disabled={!isEditing} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Degree" name="degree" value={formData.degree || ''} onChange={handleChange} disabled={!isEditing} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Graduation Year" type="number" name="graduationYear" value={formData.graduationYear || ''} onChange={handleChange} disabled={!isEditing} />
                      </Grid>
                    </>
                  )}
                </Grid>

                <Divider sx={{ my: 4 }} />

                {/* Academic Performance */}
                <Typography variant="h6" fontWeight="bold" mb={3} color="primary.main">Academic Performance & Background</Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={4}>
                    <TextField fullWidth label="10th %" type="number" name="tenthPercentage" value={formData.tenthPercentage || ''} onChange={handleChange} disabled={!isEditing} />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField fullWidth label="12th %" type="number" name="twelfthPercentage" value={formData.twelfthPercentage || ''} onChange={handleChange} disabled={!isEditing} />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField fullWidth label="CGPA" type="number" name="cgpa" value={formData.cgpa || ''} onChange={handleChange} disabled={!isEditing} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Category" name="category" value={formData.category || ''} onChange={handleChange} disabled={!isEditing} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Annual Family Income" type="number" name="annualIncome" value={formData.annualIncome || ''} onChange={handleChange} disabled={!isEditing} />
                  </Grid>
                </Grid>

                {isEditing && (
                  <Box mt={4} display="flex" justifyContent="flex-end">
                    <Button type="submit" variant="contained" color="success" startIcon={<MdSave />} size="large" sx={{ px: 4 }}>
                      Save Changes
                    </Button>
                  </Box>
                )}
              </form>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Deactivate Dialog */}
      <Dialog open={openDeactivateDialog} onClose={() => setOpenDeactivateDialog(false)}>
        <DialogTitle sx={{ color: 'error.main', fontWeight: 'bold' }}>Deactivate Account?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to deactivate your account? This will hide your profile from the platform, but your applications will be retained. You can log back in at any time to reactivate it.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setOpenDeactivateDialog(false)} color="primary">Cancel</Button>
          <Button onClick={handleDeactivate} variant="contained" color="error" autoFocus>
            Yes, Deactivate
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile;
