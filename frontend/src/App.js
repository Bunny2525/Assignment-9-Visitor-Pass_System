import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AddVisitor from './components/AddVisitor';

function App() {
  return (
    <Router>
      <div className="App" style={{ padding: '20px', fontFamily: 'sans-serif' }}>
        <h1>Visitor Pass System</h1>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-visitor" element={<AddVisitor />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;