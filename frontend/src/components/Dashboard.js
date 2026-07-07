import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import QRScanner from './QRScanner';

function Dashboard() {
  const [visitors, setVisitors] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); 
  const [userRole, setUserRole] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All');
  const [hostFilter, setHostFilter] = useState('All');
  
  const navigate = useNavigate();

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    if (storedRole) setUserRole(storedRole);

    const fetchVisitors = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/visitors', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setVisitors(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Failed to load visitors', err);
      }
    };
    fetchVisitors();
  }, []);

  const handleUpdateStatus = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`http://localhost:5000/api/visitors/scan`, 
        { appointmentId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setVisitors(visitors.map(v => v._id === id ? { ...v, status: res.data.currentStatus } : v));
    } catch (err) {
      console.error(err);
      alert('Error updating status. Check backend terminal for details.');
    }
  };

  const exportToCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,Name,Email,Phone,Host,Purpose,Status\n";
    filteredVisitors.forEach(visitor => {
      const row = `"${visitor.name || 'N/A'}","${visitor.email || 'N/A'}","${visitor.phone || 'N/A'}","${visitor.hostName || 'N/A'}","${visitor.purposeOfVisit || 'N/A'}","${visitor.status || 'N/A'}"`;
      csvContent += row + "\n";
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Visitor_Report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadBadge = (visitorId, visitorName) => {
    const badgeElement = document.getElementById(`badge-${visitorId}`);
    html2canvas(badgeElement).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: [canvas.width, canvas.height] });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      const safeName = visitorName ? visitorName.replace(' ', '_') : 'Visitor';
      pdf.save(`${safeName}_Badge.pdf`);
    });
  };

  const uniqueHosts = ['All', ...new Set(visitors.map(v => v.hostName).filter(Boolean))];

  const filteredVisitors = visitors.filter((visitor) => {
    if (!visitor || !visitor.name) return false; 

    const matchesSearch = visitor.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || visitor.status === statusFilter;
    const matchesHost = hostFilter === 'All' || visitor.hostName === hostFilter;

    let matchesDate = true;
    if (dateFilter !== 'All' && visitor.createdAt) {
      const visitorDate = new Date(visitor.createdAt);
      const today = new Date();
      
      if (dateFilter === 'Today') {
        matchesDate = visitorDate.toDateString() === today.toDateString();
      } else if (dateFilter === 'This Week') {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(today.getDate() - 7);
        matchesDate = visitorDate >= oneWeekAgo;
      }
    }

    return matchesSearch && matchesStatus && matchesHost && matchesDate;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1000px', marginBottom: '20px' }}>
        <h2>Visitor Dashboard</h2>
        <div>
          <button onClick={() => setShowScanner(true)} style={{ marginRight: '10px', padding: '10px 15px', backgroundColor: '#6f42c1', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            📷 Scan QR Code
          </button>
          <button onClick={() => navigate('/add-visitor')} style={{ padding: '10px 15px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            + Add New Visitor
          </button>
        </div>
      </div>

      {showScanner && (
        <QRScanner 
          onClose={() => setShowScanner(false)}
          onScan={(data) => {
            if (data) {
              handleUpdateStatus(data); 
              setShowScanner(false);
              alert('QR Code Scanned Successfully');
            } else {
              alert("Invalid QR Code!");
            }
          }}
        />
      )}

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', maxWidth: '1000px', marginBottom: '20px' }}>
        
        <input 
          type="text" 
          placeholder="Search name..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          style={{ flex: 1, minWidth: '150px', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} 
        />
        
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}>
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Checked-In">Checked-In</option>
          <option value="Checked-Out">Checked-Out</option>
        </select>

        <select value={hostFilter} onChange={(e) => setHostFilter(e.target.value)} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}>
          {uniqueHosts.map(host => (
            <option key={host} value={host}>{host === 'All' ? 'All Hosts' : host}</option>
          ))}
        </select>

        <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}>
          <option value="All">All Time</option>
          <option value="Today">Today</option>
          <option value="This Week">This Week</option>
        </select>

        {userRole === 'Admin' && (
          <button onClick={exportToCSV} style={{ padding: '10px 15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
            Export CSV
          </button>
        )}
      </div>
      
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {filteredVisitors.length === 0 ? <p>No visitors found matching those filters.</p> : (
          filteredVisitors.map((visitor) => (
            <div id={`badge-${visitor._id}`} key={visitor._id} style={{ border: '2px solid #333', padding: '15px', borderRadius: '8px', width: '250px', backgroundColor: 'white' }}>
              {visitor.photo && (
                <img 
                  src={visitor.photo.startsWith('http') ? visitor.photo : `http://localhost:5000/${visitor.photo.replace(/\\/g, '/')}`} 
                  alt="Visitor Face" 
                  style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', marginBottom: '10px' }} 
                />
              )}
              <h3 style={{ margin: '0 0 10px 0' }}>{visitor.name}</h3>
              <p><strong>Host:</strong> {visitor.hostName}</p>
              <p><strong>Status:</strong> <span style={{ fontWeight: 'bold', color: visitor.status === 'Checked-In' ? 'green' : 'black' }}>{visitor.status || 'Pending'}</span></p>
              {visitor.qrCodeUrl && <img src={visitor.qrCodeUrl} alt="QR" style={{ width: '150px', marginTop: '10px' }} />}
              
              <button onClick={() => downloadBadge(visitor._id, visitor.name)} style={{ marginTop: '15px', padding: '8px', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '4px', width: '100%', cursor: 'pointer' }}>Download PDF</button>
              
              {visitor.status === 'Pending' && <button onClick={() => handleUpdateStatus(visitor._id)} style={{ marginTop: '10px', padding: '8px', backgroundColor: '#28a745', color: 'white', border: 'none', width: '100%', cursor: 'pointer' }}>Check In</button>}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;