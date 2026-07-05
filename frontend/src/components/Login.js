import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });

      localStorage.setItem('token', res.data.token);
      
      // CRITICAL FIX: Strictly use the backend role, default to lowest privilege if undefined
      const userRole = res.data.user?.role || 'Visitor';
      localStorage.setItem('role', userRole);

      navigate('/dashboard');
    } catch (err) {
      if (err.response) {
        alert(`Login Failed: ${err.response.data.message}`);
      } else {
        alert('Error: Could not connect to the server');
      }
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', width: '300px', gap: '15px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2 style={{ textAlign: 'center', margin: '0 0 10px 0' }}>System Login</h2>
        
        <input 
          type="email" 
          placeholder="Email" 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        
        <input 
          type="password" 
          placeholder="Password" 
          onChange={(e) => setPassword(e.target.value)} 
          required 
          style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        
        <button type="submit" style={{ padding: '10px', cursor: 'pointer', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;