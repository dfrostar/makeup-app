import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Chip
} from '@mui/material';

const ProfessionalManagement = () => {
  const [professionals, setProfessionals] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfessionals();
  }, []);

  const fetchProfessionals = async () => {
    try {
      const response = await fetch('/api/admin/professionals');
      const data = await response.json();
      setProfessionals(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching professionals:', error);
      setLoading(false);
    }
  };

  const handleVerify = async (id) => {
    try {
      await fetch(`/api/admin/professionals/${id}/verify`, {
        method: 'POST'
      });
      fetchProfessionals();
    } catch (error) {
      console.error('Error verifying professional:', error);
    }
  };

  const handleFeature = async (id) => {
    try {
      await fetch(`/api/admin/professionals/${id}/feature`, {
        method: 'POST'
      });
      fetchProfessionals();
    } catch (error) {
      console.error('Error featuring professional:', error);
    }
  };

  const handleEdit = (professional) => {
    setSelectedProfessional(professional);
    setOpenDialog(true);
  };

  const handleSave = async () => {
    try {
      await fetch(`/api/admin/professionals/${selectedProfessional.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedProfessional),
      });
      setOpenDialog(false);
      fetchProfessionals();
    } catch (error) {
      console.error('Error updating professional:', error);
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'business_name', headerName: 'Business Name', width: 200 },
    { 
      field: 'membership_type', 
      headerName: 'Membership', 
      width: 130,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          color={
            params.value === 'elite' ? 'secondary' :
            params.value === 'premium' ? 'primary' :
            'default'
          }
        />
      )
    },
    {
      field: 'verification_status',
      headerName: 'Status',
      width: 130,
      renderCell: (params) => (
        <Chip 
          label={params.value}
          color={params.value === 'verified' ? 'success' : 'warning'}
        />
      )
    },
    {
      field: 'rating',
      headerName: 'Rating',
      width: 130,
      renderCell: (params) => (
        <div className="rating">
          {params.value} ⭐ ({params.row.review_count})
        </div>
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 300,
      renderCell: (params) => (
        <div className="action-buttons">
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleEdit(params.row)}
          >
            Edit
          </Button>
          {params.row.verification_status !== 'verified' && (
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => handleVerify(params.row.id)}
            >
              Verify
            </Button>
          )}
          <Button
            variant="contained"
            color="secondary"
            size="small"
            onClick={() => handleFeature(params.row.id)}
          >
            {params.row.is_featured ? 'Unfeature' : 'Feature'}
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="professional-management">
      <h2>Professional Management</h2>
      
      <div className="data-grid-container">
        <DataGrid
          rows={professionals}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          checkboxSelection
          disableSelectionOnClick
          loading={loading}
          autoHeight
        />
      </div>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Edit Professional</DialogTitle>
        <DialogContent>
          {selectedProfessional && (
            <>
              <TextField
                label="Name"
                fullWidth
                margin="normal"
                value={selectedProfessional.name}
                onChange={(e) => setSelectedProfessional({
                  ...selectedProfessional,
                  name: e.target.value
                })}
              />
              <TextField
                label="Business Name"
                fullWidth
                margin="normal"
                value={selectedProfessional.business_name}
                onChange={(e) => setSelectedProfessional({
                  ...selectedProfessional,
                  business_name: e.target.value
                })}
              />
              <TextField
                select
                label="Membership Type"
                fullWidth
                margin="normal"
                value={selectedProfessional.membership_type}
                onChange={(e) => setSelectedProfessional({
                  ...selectedProfessional,
                  membership_type: e.target.value
                })}
              >
                <MenuItem value="basic">Basic</MenuItem>
                <MenuItem value="premium">Premium</MenuItem>
                <MenuItem value="elite">Elite</MenuItem>
              </TextField>
              <TextField
                select
                label="Verification Status"
                fullWidth
                margin="normal"
                value={selectedProfessional.verification_status}
                onChange={(e) => setSelectedProfessional({
                  ...selectedProfessional,
                  verification_status: e.target.value
                })}
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="verified">Verified</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
              </TextField>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSave} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ProfessionalManagement;
