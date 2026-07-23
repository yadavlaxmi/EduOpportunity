import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, IconButton } from '@mui/material';
import { MdAdd, MdEdit, MdDelete } from 'react-icons/md';
import axios from 'axios';
import toast from 'react-hot-toast';

const OrganizationScholarships = () => {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    scholarshipType: 'Merit',
    amount: '',
    educationLevel: 'School',
    startDate: '',
    lastDate: '',
    status: 'Published'
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchScholarships();
  }, []);

  const fetchScholarships = async () => {
    try {
      const response = await axios.get('http://localhost:5005/api/scholarships/my', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setScholarships(response.data.scholarships);
      }
    } catch (error) {
      toast.error('Failed to load scholarships');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      scholarshipType: 'Merit',
      amount: '',
      educationLevel: 'School',
      startDate: '',
      lastDate: '',
      status: 'Published'
    });
    setOpenDialog(true);
  };

  const handleOpenEdit = (schol) => {
    setEditingId(schol._id);
    setFormData({
      title: schol.title,
      description: schol.description,
      scholarshipType: schol.scholarshipType,
      amount: schol.amount,
      educationLevel: schol.educationLevel,
      startDate: schol.startDate ? schol.startDate.split('T')[0] : '',
      lastDate: schol.lastDate ? schol.lastDate.split('T')[0] : '',
      status: schol.status
    });
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete/close this scholarship?')) return;
    try {
      const response = await axios.delete(`http://localhost:5005/api/scholarships/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        toast.success('Scholarship deleted successfully');
        fetchScholarships();
      }
    } catch (error) {
      toast.error('Failed to delete scholarship');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        amount: Number(formData.amount)
      };

      let response;
      if (editingId) {
        response = await axios.put(`http://localhost:5005/api/scholarships/${editingId}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        response = await axios.post('http://localhost:5005/api/scholarships', payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      if (response.data.success) {
        toast.success(editingId ? 'Scholarship updated successfully' : 'Scholarship created successfully');
        setOpenDialog(false);
        fetchScholarships();
      }
    } catch (error) {
      toast.error(error.response?.data?.errors?.[0]?.msg || error.response?.data?.message || 'Failed to save');
    }
  };

  if (loading) return <Typography p={4}>Loading scholarships...</Typography>;

  return (
    <Box>
      <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" fontWeight="bold" color="secondary.main">
            My Scholarships
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your listed scholarship opportunities
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<MdAdd />} onClick={handleOpenAdd}>
          Add Scholarship
        </Button>
      </Box>

      <Grid container spacing={3}>
        {scholarships.length > 0 ? scholarships.map((schol) => (
          <Grid item xs={12} sm={6} md={4} key={schol._id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: '12px' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                  <Typography variant="body2" sx={{ bgcolor: 'primary.light', color: 'white', px: 1.5, py: 0.5, borderRadius: '4px', fontWeight: 'bold' }}>
                    {schol.scholarshipType}
                  </Typography>
                  <Typography variant="body2" sx={{ bgcolor: schol.status === 'Published' ? 'success.light' : 'error.light', color: 'white', px: 1.5, py: 0.5, borderRadius: '4px', fontWeight: 'bold' }}>
                    {schol.status}
                  </Typography>
                </Box>
                <Typography variant="h6" fontWeight="bold" mt={2} gutterBottom>
                  {schol.title}
                </Typography>
                <Typography variant="h6" color="primary.main" fontWeight="bold" mb={2}>
                  ₹{schol.amount}
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                  {schol.description ? schol.description.substring(0, 100) + '...' : 'No description.'}
                </Typography>
                <Box display="flex" justifyContent="flex-end" gap={1} mt="auto">
                  <IconButton color="primary" onClick={() => handleOpenEdit(schol)}>
                    <MdEdit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(schol._id)}>
                    <MdDelete />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )) : (
          <Typography pl={3} color="text.secondary">No scholarships found. Create one now!</Typography>
        )}
      </Grid>

      {/* Add / Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingId ? 'Edit Scholarship' : 'Add Scholarship'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField label="Title" name="title" value={formData.title} onChange={handleChange} required fullWidth />
            <TextField label="Description" name="description" value={formData.description} onChange={handleChange} multiline rows={3} required fullWidth />
            <TextField select label="Scholarship Type" name="scholarshipType" value={formData.scholarshipType} onChange={handleChange} required fullWidth>
              {['Merit', 'Need Based', 'Sports', 'Minority', 'Government', 'Private', 'International', 'Other'].map(type => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </TextField>
            <TextField label="Amount (₹)" name="amount" type="number" value={formData.amount} onChange={handleChange} required fullWidth />
            <TextField select label="Education Level" name="educationLevel" value={formData.educationLevel} onChange={handleChange} required fullWidth>
              {['School', 'Diploma', 'UG', 'PG'].map(level => (
                <MenuItem key={level} value={level}>{level}</MenuItem>
              ))}
            </TextField>
            <TextField label="Start Date" name="startDate" type="date" InputLabelProps={{ shrink: true }} value={formData.startDate} onChange={handleChange} required fullWidth />
            <TextField label="Last Date" name="lastDate" type="date" InputLabelProps={{ shrink: true }} value={formData.lastDate} onChange={handleChange} required fullWidth />
            <TextField select label="Status" name="status" value={formData.status} onChange={handleChange} required fullWidth>
              {['Draft', 'Published', 'Closed'].map(status => (
                <MenuItem key={status} value={status}>{status}</MenuItem>
              ))}
            </TextField>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpenDialog(false)} color="error">Cancel</Button>
            <Button type="submit" variant="contained" color="primary">Save</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default OrganizationScholarships;
