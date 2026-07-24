import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, IconButton, Tooltip, CircularProgress, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, TablePagination, InputAdornment, Grid, Divider } from '@mui/material';
import { MdDelete, MdCheckCircle, MdCancel, MdSchool, MdEdit, MdSearch, MdVisibility } from 'react-icons/md';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminScholarships = () => {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [openEdit, setOpenEdit] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ title: '', status: 'Published' });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  const [openDetails, setOpenDetails] = useState(false);
  const [selectedSchol, setSelectedSchol] = useState(null);

  useEffect(() => {
    fetchScholarships();
  }, []);

  const fetchScholarships = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5005/api/admin/scholarships', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setScholarships(response.data.scholarships);
      }
    } catch (error) {
      toast.error('Failed to fetch scholarships');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this scholarship?")) return;
    try {
      const token = localStorage.getItem('token');
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

  const handleEditClick = (schol) => {
    setEditingItem(schol);
    setFormData({ title: schol.title, status: schol.status });
    setOpenEdit(true);
  };

  const handleEditChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://localhost:5005/api/scholarships/${editingItem._id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        toast.success('Scholarship updated successfully');
        setOpenEdit(false);
        fetchScholarships();
      }
    } catch (error) {
      toast.error('Failed to update scholarship');
    }
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><CircularProgress /></Box>;
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredScholarships = scholarships.filter(sch => 
    sch.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    sch.status?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sch.organization?.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenDetails = (schol) => {
    setSelectedSchol(schol);
    setOpenDetails(true);
  };

  return (
    <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" color="primary.main">Manage Scholarships</Typography>
          <Typography variant="body1" color="text.secondary">View and manage all scholarships on the platform</Typography>
        </Box>
        <TextField
          placeholder="Search by title, org or status"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ bgcolor: 'white', minWidth: '300px' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <MdSearch size={20} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: 'rgba(0,0,0,0.02)' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Title</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Organization</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredScholarships.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((sch) => (
              <TableRow key={sch._id} sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: 'rgba(0,0,0,0.01)' } }}>
                <TableCell>
                  <Typography fontWeight="500">{sch.title}</Typography>
                </TableCell>
                <TableCell>{sch.organization?.fullName || 'Unknown'}</TableCell>
                <TableCell>
                  <Chip label={sch.scholarshipType} size="small" sx={{ bgcolor: '#E0F2FE', color: '#0284C7', fontWeight: 'bold' }} />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={sch.status} 
                    size="small"
                    sx={{ 
                      bgcolor: sch.status === 'Published' ? '#D1FAE5' : '#FEE2E2',
                      color: sch.status === 'Published' ? '#10B981' : '#EF4444',
                      fontWeight: 'bold'
                    }} 
                  />
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="View Details">
                    <IconButton color="info" onClick={() => handleOpenDetails(sch)}>
                      <MdVisibility />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit Scholarship">
                    <IconButton color="primary" onClick={() => handleEditClick(sch)}>
                      <MdEdit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Scholarship">
                    <IconButton color="error" onClick={() => handleDelete(sch._id)}>
                      <MdDelete />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredScholarships.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Edit Dialog */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Scholarship</DialogTitle>
        <form onSubmit={handleEditSubmit}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Title" name="title" value={formData.title} onChange={handleEditChange} required fullWidth />
            <TextField select label="Status" name="status" value={formData.status} onChange={handleEditChange} required fullWidth>
              <MenuItem value="Draft">Draft</MenuItem>
              <MenuItem value="Published">Published</MenuItem>
              <MenuItem value="Closed">Closed</MenuItem>
            </TextField>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
            <Button type="submit" variant="contained">Save Changes</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={openDetails} onClose={() => setOpenDetails(false)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight="bold">{selectedSchol?.title}</DialogTitle>
        <DialogContent>
          <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
            <Chip label={`Type: ${selectedSchol?.scholarshipType}`} color="primary" variant="outlined" />
            <Chip label={`Level: ${selectedSchol?.educationLevel}`} color="secondary" variant="outlined" />
            <Chip label={`Amount: ₹${selectedSchol?.amount}`} color="success" />
          </Box>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" fontWeight="bold">Description</Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            {selectedSchol?.description}
          </Typography>
          
          <Typography variant="subtitle1" fontWeight="bold" mt={2}>Important Dates</Typography>
          <Typography variant="body2" color="text.secondary">
            Start Date: {selectedSchol?.startDate ? new Date(selectedSchol.startDate).toLocaleDateString() : 'N/A'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Last Date to Apply: {selectedSchol?.lastDate ? new Date(selectedSchol.lastDate).toLocaleDateString() : 'N/A'}
          </Typography>

          {selectedSchol?.organization && (
            <>
              <Typography variant="subtitle1" fontWeight="bold" mt={2}>Offered By</Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedSchol.organization.fullName || 'N/A'} ({selectedSchol.organization.email || 'N/A'})
              </Typography>
            </>
          )}

          <Typography variant="subtitle1" fontWeight="bold" mt={2}>Additional Details</Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                <strong>Application Fee:</strong> ₹{selectedSchol?.applicationFee || 0}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                <strong>Mode:</strong> {selectedSchol?.applicationMode || 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                <strong>Min Percentage:</strong> {selectedSchol?.minimumPercentage ? `${selectedSchol.minimumPercentage}%` : 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                <strong>Total Seats:</strong> {selectedSchol?.totalSeats || 'N/A'}
              </Typography>
            </Grid>
            {selectedSchol?.officialWebsite && (
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Official Website:</strong> <a href={selectedSchol.officialWebsite} target="_blank" rel="noreferrer" style={{color: '#1976d2'}}>{selectedSchol.officialWebsite}</a>
                </Typography>
              </Grid>
            )}
            {selectedSchol?.applicationLink && (
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Application Link:</strong> <a href={selectedSchol.applicationLink} target="_blank" rel="noreferrer" style={{color: '#1976d2'}}>{selectedSchol.applicationLink}</a>
                </Typography>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenDetails(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminScholarships;
