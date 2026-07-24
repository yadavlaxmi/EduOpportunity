import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, IconButton, Tooltip, CircularProgress, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, TablePagination, InputAdornment, Grid, Divider } from '@mui/material';
import { MdDelete, MdCheckCircle, MdCancel, MdEmojiEvents, MdEdit, MdSearch, MdVisibility } from 'react-icons/md';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminOlympiads = () => {
  const [olympiads, setOlympiads] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [openEdit, setOpenEdit] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ title: '', status: 'Published' });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  const [openDetails, setOpenDetails] = useState(false);
  const [selectedOlym, setSelectedOlym] = useState(null);

  useEffect(() => {
    fetchOlympiads();
  }, []);

  const fetchOlympiads = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5005/api/admin/olympiads', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setOlympiads(response.data.olympiads);
      }
    } catch (error) {
      toast.error('Failed to fetch olympiads');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this olympiad?")) return;
    try {
      const token = localStorage.getItem('token');
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

  const handleEditClick = (oly) => {
    setEditingItem(oly);
    setFormData({ title: oly.title, status: oly.status });
    setOpenEdit(true);
  };

  const handleEditChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://localhost:5005/api/olympiads/${editingItem._id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        toast.success('Olympiad updated successfully');
        setOpenEdit(false);
        fetchOlympiads();
      }
    } catch (error) {
      toast.error('Failed to update olympiad');
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

  const filteredOlympiads = olympiads.filter(oly => 
    oly.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    oly.status?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    oly.organization?.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenDetails = (olym) => {
    setSelectedOlym(olym);
    setOpenDetails(true);
  };

  return (
    <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" color="primary.main">Manage Olympiads</Typography>
          <Typography variant="body1" color="text.secondary">View and manage all olympiads on the platform</Typography>
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
            {filteredOlympiads.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((oly) => (
              <TableRow key={oly._id} sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: 'rgba(0,0,0,0.01)' } }}>
                <TableCell>
                  <Typography fontWeight="500">{oly.title}</Typography>
                </TableCell>
                <TableCell>{oly.organization?.fullName || 'Unknown'}</TableCell>
                <TableCell>
                  <Chip label={oly.olympiadType} size="small" sx={{ bgcolor: '#F3E8FF', color: '#7E22CE', fontWeight: 'bold' }} />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={oly.status} 
                    size="small"
                    sx={{ 
                      bgcolor: oly.status === 'Published' ? '#D1FAE5' : '#FEE2E2',
                      color: oly.status === 'Published' ? '#10B981' : '#EF4444',
                      fontWeight: 'bold'
                    }} 
                  />
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="View Details">
                    <IconButton color="info" onClick={() => handleOpenDetails(oly)}>
                      <MdVisibility />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit Olympiad">
                    <IconButton color="primary" onClick={() => handleEditClick(oly)}>
                      <MdEdit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Olympiad">
                    <IconButton color="error" onClick={() => handleDelete(oly._id)}>
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
          count={filteredOlympiads.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Edit Dialog */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Olympiad</DialogTitle>
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
        <DialogTitle fontWeight="bold">{selectedOlym?.title}</DialogTitle>
        <DialogContent>
          <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
            <Chip label={`Subject: ${selectedOlym?.olympiadType}`} color="warning" variant="outlined" />
            <Chip label={`Level: ${selectedOlym?.educationLevel}`} color="secondary" variant="outlined" />
            <Chip label={`Fee: ₹${selectedOlym?.registrationFee || 0}`} color="success" />
          </Box>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" fontWeight="bold">Description</Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            {selectedOlym?.description}
          </Typography>
          
          <Typography variant="subtitle1" fontWeight="bold" mt={2}>Important Dates</Typography>
          <Typography variant="body2" color="text.secondary">
            Registration Starts: {selectedOlym?.registrationStartDate ? new Date(selectedOlym.registrationStartDate).toLocaleDateString() : 'N/A'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Registration Ends: {selectedOlym?.registrationEndDate ? new Date(selectedOlym.registrationEndDate).toLocaleDateString() : 'N/A'}
          </Typography>
          {selectedOlym?.examDate && (
            <Typography variant="body2" color="text.secondary">
              Exam Date: {new Date(selectedOlym.examDate).toLocaleDateString()}
            </Typography>
          )}

          {selectedOlym?.organization && (
            <>
              <Typography variant="subtitle1" fontWeight="bold" mt={2}>Hosted By</Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedOlym.organization.fullName || 'N/A'} ({selectedOlym.organization.email || 'N/A'})
              </Typography>
            </>
          )}

          <Typography variant="subtitle1" fontWeight="bold" mt={2}>Additional Details</Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                <strong>Exam Mode:</strong> {selectedOlym?.examMode || 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                <strong>Duration:</strong> {selectedOlym?.examDuration || 'N/A'}
              </Typography>
            </Grid>
            {selectedOlym?.syllabus && (
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Syllabus:</strong> {selectedOlym.syllabus}
                </Typography>
              </Grid>
            )}
            {selectedOlym?.prizes && selectedOlym.prizes.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Prizes:</strong> {selectedOlym.prizes.join(', ')}
                </Typography>
              </Grid>
            )}
            {selectedOlym?.officialWebsite && (
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Official Website:</strong> <a href={selectedOlym.officialWebsite} target="_blank" rel="noreferrer" style={{color: '#1976d2'}}>{selectedOlym.officialWebsite}</a>
                </Typography>
              </Grid>
            )}
            {selectedOlym?.applicationLink && (
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Application Link:</strong> <a href={selectedOlym.applicationLink} target="_blank" rel="noreferrer" style={{color: '#1976d2'}}>{selectedOlym.applicationLink}</a>
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

export default AdminOlympiads;
