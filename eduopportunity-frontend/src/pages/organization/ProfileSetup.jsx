import React, { useState } from 'react';
import { Box, Card, Typography, TextField, Button, MenuItem, Grid, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const OrganizationProfileSetup = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    organizationName: '',
    organizationType: 'NGO',
    contactPerson: '',
    designation: '',
    phone: '',
    alternatePhone: '',
    email: '',
    website: '',
    address: '',
    city: '',
    district: '',
    state: '',
    pincode: '',
    registrationNumber: '',
    establishedYear: '',
    about: '',
    linkedin: '',
    facebook: '',
    instagram: '',
    twitter: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      // Format payload properly
      const payload = {
        organizationName: formData.organizationName,
        organizationType: formData.organizationType,
        contactPerson: formData.contactPerson,
        designation: formData.designation,
        phone: formData.phone,
        alternatePhone: formData.alternatePhone,
        email: formData.email,
        website: formData.website,
        address: formData.address,
        city: formData.city,
        district: formData.district,
        state: formData.state,
        pincode: formData.pincode,
        registrationNumber: formData.registrationNumber,
        establishedYear: formData.establishedYear ? Number(formData.establishedYear) : null,
        about: formData.about,
        socialLinks: {
          linkedin: formData.linkedin,
          facebook: formData.facebook,
          instagram: formData.instagram,
          twitter: formData.twitter,
        }
      };

      const response = await axios.post('http://localhost:5005/api/organization/profile', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        toast.success('Organization profile setup complete!');
        const user = JSON.parse(localStorage.getItem('user'));
        user.profileCompleted = true;
        localStorage.setItem('user', JSON.stringify(user));
        navigate('/organization/dashboard');
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
          <Typography variant="h4" fontWeight="bold" color="primary.main">Organization Profile Setup</Typography>
          <Typography variant="body1" color="text.secondary">Provide details to register your organization and publish opportunities</Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Primary Details */}
            <Grid item xs={12}>
              <Typography variant="h6" fontWeight="bold" color="secondary.main">1. Basic Information</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Organization Name" name="organizationName" value={formData.organizationName} onChange={handleChange} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField select fullWidth label="Organization Type" name="organizationType" value={formData.organizationType} onChange={handleChange} required>
                {['School', 'College', 'University', 'NGO', 'Government', 'Private Company', 'Foundation', 'Trust', 'Other'].map(type => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Contact Person Name" name="contactPerson" value={formData.contactPerson} onChange={handleChange} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Designation" name="designation" value={formData.designation} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Alternate Phone Number" name="alternatePhone" value={formData.alternatePhone} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Organization Email" name="email" type="email" value={formData.email} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Website URL" name="website" value={formData.website} onChange={handleChange} />
            </Grid>

            {/* Address Details */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography variant="h6" fontWeight="bold" color="secondary.main">2. Address & Location</Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Address" name="address" value={formData.address} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="City" name="city" value={formData.city} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="District" name="district" value={formData.district} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="State" name="state" value={formData.state} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Pincode" name="pincode" value={formData.pincode} onChange={handleChange} />
            </Grid>

            {/* Verification & registration Details */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography variant="h6" fontWeight="bold" color="secondary.main">3. Registration & Description</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Registration Number" name="registrationNumber" value={formData.registrationNumber} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Established Year" name="establishedYear" type="number" value={formData.establishedYear} onChange={handleChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth multiline rows={3} label="About the Organization" name="about" value={formData.about} onChange={handleChange} />
            </Grid>

            {/* Social Links */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography variant="h6" fontWeight="bold" color="secondary.main">4. Social Links</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="LinkedIn URL" name="linkedin" value={formData.linkedin} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Facebook URL" name="facebook" value={formData.facebook} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Instagram URL" name="instagram" value={formData.instagram} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Twitter URL" name="twitter" value={formData.twitter} onChange={handleChange} />
            </Grid>
          </Grid>

          {/* Submit */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
            <Button type="submit" variant="contained" color="primary" size="large" sx={{ px: 8, py: 1.5, fontWeight: 'bold' }} disabled={loading}>
              {loading ? 'Submitting...' : 'Complete Profile Setup'}
            </Button>
          </Box>
        </form>
      </Card>
    </Container>
  );
};

export default OrganizationProfileSetup;
