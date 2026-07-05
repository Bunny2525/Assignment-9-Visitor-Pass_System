import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddVisitor() {
  const [formData, setFormData] = useState({
    hostId: '', // We now strictly use the MongoDB ObjectId for the relational database
    dateOfVisit: '',
    purposeOfVisit: ''
  });
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      // Notice we are hitting the CORRECT new endpoint: /request
      await axios.post('http://localhost:5000/api/visitors/request', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert('Visit Request Submitted Successfully! Waiting for Host Approval.');
      navigate('/dashboard');
    } catch (err) {
      alert('Error requesting visit: ' + (err.response?.data?.message || 'Server error'));
    }
  };

  return (
    <div style={{ maxWidth: '450px', margin: '40px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
      <h2 style={{ marginTop: 0 }}>Request a Visit Pass</h2>
      
      <p style={{ fontSize: '14px', color: '#555', marginBottom: '20px' }}>
        <em>Note: Because you are securely logged in, the system already knows your identity. You only need to provide the visit details below.</em>
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        <div>
          <label><strong>Host Employee ID:</strong></label><br />
          <input 
            type="text" 
            name="hostId" 
            placeholder="Paste the 24-character Host ID here" 
            onChange={handleChange} 
            required 
            style={{ width: '100%', padding: '10px', marginTop: '5px', boxSizing: 'border-box' }}
          />
          <small style={{ color: '#dc3545' }}>*For the demo, open MongoDB Compass and copy Bruce Wayne's ID.</small>
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
            placeholder="e.g., Job Interview, Client Meeting" 
            onChange={handleChange} 
            required 
            style={{ width: '100%', padding: '10px', marginTop: '5px', boxSizing: 'border-box' }}
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