import React, { useEffect, useState } from 'react';
import { Box, Typography, Avatar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, IconButton, Tooltip, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Button, TablePagination, InputAdornment } from '@mui/material';
import { MdPeople, MdDelete, MdEdit, MdCheckCircle, MdCancel, MdSearch } from 'react-icons/md';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [openEdit, setOpenEdit] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ fullName: '', email: '', role: '', isActive: true });
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5005/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setUsers(response.data.users);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(`http://localhost:5005/api/admin/users/${userId}/status`, 
        { isActive: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        toast.success(`User status updated successfully`);
        fetchUsers();
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`http://localhost:5005/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        toast.success('User deleted successfully');
        fetchUsers();
      }
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setFormData({
      fullName: user.fullName || '',
      email: user.email || '',
      role: user.role || 'student',
      isActive: user.isActive
    });
    setOpenEdit(true);
  };

  const handleEditChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://localhost:5005/api/admin/users/${editingUser._id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        toast.success('User updated successfully');
        setOpenEdit(false);
        fetchUsers();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update user');
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

  const filteredUsers = users.filter(user => 
    user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" color="primary.main">Manage Users</Typography>
          <Typography variant="body1" color="text.secondary">View, edit, or delete platform users</Typography>
        </Box>
        <TextField
          placeholder="Search by name, email or role"
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
              <TableCell sx={{ fontWeight: 'bold' }}>User</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Role</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
              <TableRow key={user._id} sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: 'rgba(0,0,0,0.01)' } }}>
                <TableCell component="th" scope="row">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar src={user.profilePicture || ''} sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
                      {user.fullName ? user.fullName[0].toUpperCase() : 'U'}
                    </Avatar>
                    <Typography fontWeight="500">{user.fullName}</Typography>
                  </Box>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip 
                    label={user.role} 
                    size="small"
                    sx={{ 
                      textTransform: 'capitalize',
                      bgcolor: user.role === 'admin' ? '#FEE2E2' : user.role === 'organization' ? '#EDE9FE' : '#E0F2FE',
                      color: user.role === 'admin' ? '#EF4444' : user.role === 'organization' ? '#8B5CF6' : '#0284C7',
                      fontWeight: 'bold'
                    }} 
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={user.isActive ? 'Active' : 'Inactive'} 
                    size="small"
                    icon={user.isActive ? <MdCheckCircle /> : <MdCancel />}
                    sx={{ 
                      bgcolor: user.isActive ? '#D1FAE5' : '#FEE2E2',
                      color: user.isActive ? '#10B981' : '#EF4444',
                      fontWeight: 'bold'
                    }} 
                  />
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Edit User">
                    <IconButton color="primary" onClick={() => handleEditClick(user)}>
                      <MdEdit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={user.isActive ? "Deactivate User" : "Activate User"}>
                    <IconButton 
                      color={user.isActive ? "error" : "success"}
                      onClick={() => handleStatusChange(user._id, !user.isActive)}
                    >
                      {user.isActive ? <MdCancel /> : <MdCheckCircle />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete User">
                    <IconButton color="error" onClick={() => handleDelete(user._id)}>
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
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Edit Dialog */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit User</DialogTitle>
        <form onSubmit={handleEditSubmit}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Full Name" name="fullName" value={formData.fullName} onChange={handleEditChange} required fullWidth />
            <TextField label="Email" name="email" value={formData.email} onChange={handleEditChange} required fullWidth />
            <TextField select label="Role" name="role" value={formData.role} onChange={handleEditChange} required fullWidth>
              <MenuItem value="student">Student</MenuItem>
              <MenuItem value="organization">Organization</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </TextField>
            <TextField select label="Status" name="isActive" value={formData.isActive} onChange={(e) => setFormData({...formData, isActive: e.target.value === 'true'})} required fullWidth>
              <MenuItem value="true">Active</MenuItem>
              <MenuItem value="false">Inactive</MenuItem>
            </TextField>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
            <Button type="submit" variant="contained">Save Changes</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default AdminUsers;
