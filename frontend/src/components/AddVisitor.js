import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddVisitor() {
  const [formData, setFormData] = useState({
    hostId: '',
    dateOfVisit: '',
    purposeOfVisit: ''
  });
  const [photo, setPhoto] = useState(null);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      const submitData = new FormData();
      submitData.append('hostId', formData.hostId);
      submitData.append('dateOfVisit', formData.dateOfVisit);
      submitData.append('purposeOfVisit', formData.purposeOfVisit);
      if (photo) {
        submitData.append('photo', photo);
      }

      await axios.post('http://localhost:5000/api/visitors/request', submitData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      alert('Visit request submitted successfully');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Error requesting visit: ' + (err.response?.data?.message || 'Server error'));
    }
  };

  return (
    <div style={{ maxWidth: '450px', margin: '40px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
      <h2 style={{ marginTop: 0 }}>Request a Visit Pass</h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        <div>
          <label><strong>Host Employee ID:</strong></label><br />
          <input 
            type="text" 
            name="hostId" 
            placeholder="Enter Host ID" 
            onChange={handleChange} 
            required 
            style={{ width: '100%', padding: '10px', marginTop: '5px', boxSizing: 'border-box' }}
          />
        </div>

        <div>
          <label><strong>Date of Visit:</strong></label><br />
          <input 
            type="date" 
            name="dateOfVisit" 
            onChange={handleChange} 
            required 
            style={{ width: '100%', padding: '10px', marginTop: '5px', boxSizing: 'border-box' }}
          />
        </div>

        <div>
          <label><strong>Purpose of Visit:</strong></label><br />
          <input 
            type="text" 
            name="purposeOfVisit" 
            placeholder="e.g., Job Interview, Meeting" 
            onChange={handleChange} 
            required 
            style={{ width: '100%', padding: '10px', marginTop: '5px', boxSizing: 'border-box' }}
          />
        </div>

        <div>
          <label><strong>Visitor Photo:</strong></label><br />
          <input 
            type="file" 
            accept="image/*" 
            name="photo" 
            onChange={handleFileChange} 
            required 
            style={{ width: '100%', padding: '10px', marginTop: '5px', boxSizing: 'border-box', backgroundColor: 'white' }}
          />
        </div>
        
        <button type="submit" style={{ padding: '12px', cursor: 'pointer', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '5px', fontSize: '16px', fontWeight: 'bold' }}>
          Submit Request
        </button>
        <button type="button" onClick={() => navigate('/dashboard')} style={{ padding: '12px', cursor: 'pointer', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', fontSize: '16px' }}>
          Cancel
        </button>
      </form>
    </div>
  );
}

export default AddVisitor;