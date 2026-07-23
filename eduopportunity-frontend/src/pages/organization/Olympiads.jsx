import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, IconButton } from '@mui/material';
import { MdAdd, MdEdit, MdDelete } from 'react-icons/md';
import axios from 'axios';
import toast from 'react-hot-toast';

const OrganizationOlympiads = () => {
  const [olympiads, setOlympiads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    olympiadType: 'Mathematics',
    educationLevel: 'School',
    registrationStartDate: '',
    registrationEndDate: '',
    status: 'Published'
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchOlympiads();
  }, []);

  const fetchOlympiads = async () => {
    try {
      const response = await axios.get('http://localhost:5005/api/olympiads/my', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setOlympiads(response.data.olympiads);
      }
    } catch (error) {
      toast.error('Failed to load olympiads');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      olympiadType: 'Mathematics',
      educationLevel: 'School',
      registrationStartDate: '',
      registrationEndDate: '',
      status: 'Published'
    });
    setOpenDialog(true);
  };

  const handleOpenEdit = (olym) => {
    setEditingId(olym._id);
    setFormData({
      title: olym.title,
      description: olym.description,
      olympiadType: olym.olympiadType,
      educationLevel: olym.educationLevel,
      registrationStartDate: olym.registrationStartDate ? olym.registrationStartDate.split('T')[0] : '',
      registrationEndDate: olym.registrationEndDate ? olym.registrationEndDate.split('T')[0] : '',
      status: olym.status
    });
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete/close this olympiad?')) return;
    try {
      const response = await axios.delete(`http://localhost:5005/api/olympiads/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        toast.success('Olympiad deleted successfully');
        fetchOlympiads();
      }
    } catch (error) {
      toast.error('Failed to delete olympiad');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (editingId) {
        response = await axios.put(`http://localhost:5005/api/olympiads/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        response = await axios.post('http://localhost:5005/api/olympiads', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      if (response.data.success) {
        toast.success(editingId ? 'Olympiad updated successfully' : 'Olympiad created successfully');
        setOpenDialog(false);
        fetchOlympiads();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save');
    }
  };

  if (loading) return <Typography p={4}>Loading olympiads...</Typography>;

  return (
    <Box>
      <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" fontWeight="bold" color="secondary.main">
            My Olympiads
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your listed olympiads
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<MdAdd />} onClick={handleOpenAdd} color="warning">
          Add Olympiad
        </Button>
      </Box>

      <Grid container spacing={3}>
        {olympiads.length > 0 ? olympiads.map((olym) => (
          <Grid item xs={12} sm={6} md={4} key={olym._id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: '12px' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                  <Typography variant="body2" sx={{ bgcolor: 'warning.light', color: 'white', px: 1.5, py: 0.5, borderRadius: '4px', fontWeight: 'bold' }}>
                    {olym.olympiadType}
                  </Typography>
                  <Typography variant="body2" sx={{ bgcolor: olym.status === 'Published' ? 'success.light' : 'error.light', color: 'white', px: 1.5, py: 0.5, borderRadius: '4px', fontWeight: 'bold' }}>
                    {olym.status}
                  </Typography>
                </Box>
                <Typography variant="h6" fontWeight="bold" mt={2} gutterBottom>
                  {olym.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                  {olym.description ? olym.description.substring(0, 100) + '...' : 'No description.'}
                </Typography>
                <Box display="flex" justifyContent="flex-end" gap={1} mt="auto">
                  <IconButton color="primary" onClick={() => handleOpenEdit(olym)}>
                    <MdEdit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(olym._id)}>
                    <MdDelete />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )) : (
          <Typography pl={3} color="text.secondary">No olympiads found. Create one now!</Typography>
        )}
      </Grid>

      {/* Add / Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingId ? 'Edit Olympiad' : 'Add Olympiad'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField label="Title" name="title" value={formData.title} onChange={handleChange} required fullWidth />
            <TextField label="Description" name="description" value={formData.description} onChange={handleChange} multiline rows={3} required fullWidth />
            <TextField select label="Olympiad Type" name="olympiadType" value={formData.olympiadType} onChange={handleChange} required fullWidth>
              {['Mathematics', 'Science', 'Coding', 'English', 'GK', 'Robotics', 'Other'].map(type => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </TextField>
            <TextField select label="Education Level" name="educationLevel" value={formData.educationLevel} onChange={handleChange} required fullWidth>
              {['School', 'Diploma', 'UG', 'PG'].map(level => (
                <MenuItem key={level} value={level}>{level}</MenuItem>
              ))}
            </TextField>
            <TextField label="Registration Start Date" name="registrationStartDate" type="date" InputLabelProps={{ shrink: true }} value={formData.registrationStartDate} onChange={handleChange} required fullWidth />
            <TextField label="Registration End Date" name="registrationEndDate" type="date" InputLabelProps={{ shrink: true }} value={formData.registrationEndDate} onChange={handleChange} required fullWidth />
            <TextField select label="Status" name="status" value={formData.status} onChange={handleChange} required fullWidth>
              {['Draft', 'Published', 'Closed'].map(status => (
                <MenuItem key={status} value={status}>{status}</MenuItem>
              ))}
            </TextField>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpenDialog(false)} color="error">Cancel</Button>
            <Button type="submit" variant="contained" color="warning">Save</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default OrganizationOlympiads;
