import React, { useState, useEffect } from 'react';
import { Box, Card, Typography, TextField, Button, Grid, Avatar, Divider, Container } from '@mui/material';
import { MdEdit, MdSave, MdClose } from 'react-icons/md';
import axios from 'axios';
import toast from 'react-hot-toast';

const OrganizationProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({});

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('http://localhost:5005/api/organization/profile', {
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
        establishedYear: formData.establishedYear ? Number(formData.establishedYear) : null,
      };

      const response = await axios.put('http://localhost:5005/api/organization/profile', payload, {
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

  if (loading) return <Typography sx={{ p: 4 }}>Loading profile...</Typography>;

  if (!profileData) {
    return <Typography sx={{ p: 4 }}>Profile not found. Please complete profile setup.</Typography>;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" fontWeight="bold" color="secondary.main">
          Organization Profile
        </Typography>
        {!isEditing ? (
          <Button variant="contained" startIcon={<MdEdit />} onClick={() => setIsEditing(true)}>
            Edit Profile
          </Button>
        ) : (
          <Box display="flex" gap={2}>
            <Button variant="outlined" color="error" startIcon={<MdClose />} onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button variant="contained" color="success" startIcon={<MdSave />} onClick={handleUpdate}>
              Save
            </Button>
          </Box>
        )}
      </Box>

      <Grid container spacing={4}>
        {/* Left Card: Summary */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 4, textAlign: 'center', borderRadius: '16px', boxShadow: 'var(--shadow-md)' }}>
            <Avatar sx={{ width: 100, height: 100, mx: 'auto', mb: 2, bgcolor: 'primary.main', fontSize: '2.5rem' }}>
              {profileData.organizationName?.charAt(0) || 'O'}
            </Avatar>
            <Typography variant="h5" fontWeight="bold">
              {profileData.organizationName}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, px: 2, py: 0.5, bgcolor: 'rgba(37, 99, 235, 0.1)', color: 'primary.main', display: 'inline-block', borderRadius: '4px', fontWeight: 'bold' }}>
              {profileData.organizationType}
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={2}>
              {profileData.city && profileData.state ? `${profileData.city}, ${profileData.state}` : 'Location not provided'}
            </Typography>
          </Card>
        </Grid>

        {/* Right Card: Full Details / Form */}
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 4, borderRadius: '16px', boxShadow: 'var(--shadow-md)' }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom color="primary.main">
              Organization Details
            </Typography>
            <Divider sx={{ mb: 4 }} />

            <form onSubmit={handleUpdate}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Organization Name"
                    name="organizationName"
                    value={formData.organizationName || ''}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Organization Type"
                    name="organizationType"
                    value={formData.organizationType || ''}
                    onChange={handleChange}
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Contact Person Name"
                    name="contactPerson"
                    value={formData.contactPerson || ''}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Designation"
                    name="designation"
                    value={formData.designation || ''}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Alternate Phone"
                    name="alternatePhone"
                    value={formData.alternatePhone || ''}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Website"
                    name="website"
                    value={formData.website || ''}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle1" fontWeight="bold" color="text.secondary" mt={2}>
                    Address
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address"
                    name="address"
                    value={formData.address || ''}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="City"
                    name="city"
                    value={formData.city || ''}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="State"
                    name="state"
                    value={formData.state || ''}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle1" fontWeight="bold" color="text.secondary" mt={2}>
                    About
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="About Organization"
                    name="about"
                    value={formData.about || ''}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </Grid>
              </Grid>
            </form>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default OrganizationProfile;
