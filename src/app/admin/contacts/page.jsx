"use client";

import { useEffect, useState } from "react";
import { 
  Phone, 
  Mail, 
  MapPin, 
  MessageSquare, 
  Calendar, 
  User,
  Search,
  Filter,
  Download,
  Eye,
  Trash2,
  RefreshCw,
  Users
} from "lucide-react";

export default function AdminContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  const [selectedContact, setSelectedContact] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = () => {
    setLoading(true);
    fetch("/api/contact")
      .then(r => r.json())
      .then(data => {
        if (data.success) setContacts(data.contacts || []);
      })
      .finally(() => setLoading(false));
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.phone?.includes(searchTerm) ||
                         contact.message?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterBy === "all" || 
                         (filterBy === "recent" && new Date(contact.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
    
    return matchesSearch && matchesFilter;
  });

  const deleteContact = (id) => {
    if (confirm("Are you sure you want to delete this contact?")) {
      fetch(`/api/contact/${id}`, { method: "DELETE" })
        .then(() => {
          setContacts(contacts.filter(c => c._id !== id));
        });
    }
  };

  const exportContacts = () => {
    const csv = [
      ["Name", "Email", "Phone", "Address", "Message", "Date"],
      ...filteredContacts.map(c => [
        c.name, c.email, c.phone, c.address, c.message, 
        new Date(c.createdAt).toLocaleString()
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(",")).join("\n");
    
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "contacts.csv";
    a.click();
  };

  if (loading) {
    return (
      <div style={{
        background: '#fff3db',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <RefreshCw size={48} style={{ color: '#ff6b35', animation: 'spin 1s linear infinite' }} />
          <p style={{ color: '#666', fontSize: '1.1rem' }}>Loading contacts...</p>
        </div>
        <style jsx>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        .admin-container {
          background: #fff3db;
          min-height: 100vh;
          padding: 2rem;
        }
        
        .header-section {
          background: rgba(255, 255, 255, 0.8);
          border-radius: 20px;
          padding: 2rem;
          margin-bottom: 2rem;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 107, 53, 0.1);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        
        .header-title {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        
        .title {
          font-size: 2.5rem;
          font-weight: 800;
          color: #1a1a1a;
          margin: 0;
        }
        
        .subtitle {
          color: #666;
          font-size: 1rem;
          margin: 0;
        }
        
        .stats {
          display: flex;
          gap: 2rem;
          margin-top: 1.5rem;
        }
        
        .stat-card {
          background: linear-gradient(135deg, #ff6b35, #ff8f65);
          color: white;
          padding: 1.5rem;
          border-radius: 16px;
          display: flex;
          align-items: center;
          gap: 1rem;
          min-width: 200px;
          box-shadow: 0 8px 25px rgba(255, 107, 53, 0.3);
        }
        
        .stat-number {
          font-size: 2rem;
          font-weight: 800;
          margin: 0;
        }
        
        .stat-label {
          font-size: 0.9rem;
          opacity: 0.9;
          margin: 0;
        }
        
        .controls-section {
          background: rgba(255, 255, 255, 0.8);
          border-radius: 20px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 107, 53, 0.1);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        
        .controls {
          display: flex;
          gap: 1rem;
          align-items: center;
          flex-wrap: wrap;
        }
        
        .search-container {
          position: relative;
          flex: 1;
          min-width: 250px;
        }
        
        .search-input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 3rem;
          border: 2px solid rgba(255, 107, 53, 0.2);
          border-radius: 12px;
          font-size: 1rem;
          background: white;
          transition: border-color 0.3s ease;
        }
        
        .search-input:focus {
          outline: none;
          border-color: #ff6b35;
          box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
        }
        
        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #666;
        }
        
        .filter-select {
          padding: 0.75rem 1rem;
          border: 2px solid rgba(255, 107, 53, 0.2);
          border-radius: 12px;
          font-size: 1rem;
          background: white;
          min-width: 120px;
        }
        
        .action-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .refresh-button {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
        }
        
        .refresh-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
        }
        
        .export-button {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white;
        }
        
        .export-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
        }
        
        .table-container {
          background: rgba(255, 255, 255, 0.9);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 107, 53, 0.1);
        }
        
        .table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .table-header {
          background: linear-gradient(135deg, #ff6b35, #ff8f65);
          color: white;
        }
        
        .table-header th {
          padding: 1rem;
          text-align: left;
          font-weight: 600;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .table-row {
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          transition: background-color 0.3s ease;
        }
        
        .table-row:hover {
          background: rgba(255, 107, 53, 0.05);
        }
        
        .table-cell {
          padding: 1rem;
          font-size: 0.9rem;
          color: #333;
          vertical-align: top;
        }
        
        .message-preview {
          max-width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .action-buttons {
          display: flex;
          gap: 0.5rem;
        }
        
        .view-button {
          background: #10b981;
          color: white;
          border: none;
          padding: 0.5rem;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.3s ease;
        }
        
        .view-button:hover {
          background: #059669;
        }
        
        .delete-button {
          background: #ef4444;
          color: white;
          border: none;
          padding: 0.5rem;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.3s ease;
        }
        
        .delete-button:hover {
          background: #dc2626;
        }
        
        .modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 2rem;
        }
        
        .modal-content {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          max-width: 600px;
          width: 100%;
          max-height: 80vh;
          overflow-y: auto;
        }
        
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid rgba(255, 107, 53, 0.1);
        }
        
        .modal-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0;
        }
        
        .close-button {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #666;
        }
        
        .contact-detail {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          margin-bottom: 1rem;
          padding: 1rem;
          background: rgba(255, 107, 53, 0.05);
          border-radius: 12px;
        }
        
        .detail-icon {
          color: #ff6b35;
          margin-top: 0.2rem;
        }
        
        .detail-content h4 {
          margin: 0 0 0.5rem 0;
          color: #1a1a1a;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .detail-content p {
          margin: 0;
          color: #333;
          line-height: 1.5;
        }
        
        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          color: #666;
        }
        
        .empty-icon {
          color: #ff6b35;
          margin-bottom: 1rem;
        }
        
        @media (max-width: 768px) {
          .admin-container {
            padding: 1rem;
          }
          
          .controls {
            flex-direction: column;
            align-items: stretch;
          }
          
          .search-container {
            min-width: auto;
          }
          
          .stats {
            flex-direction: column;
            gap: 1rem;
          }
          
          .table-container {
            overflow-x: auto;
          }
          
          .table {
            min-width: 800px;
          }
          
          .modal {
            padding: 1rem;
          }
        }
      `}</style>

      <div className="admin-container">
        {/* Header Section */}
        <div className="header-section">
          <div className="header-title">
            <Users size={40} style={{ color: '#ff6b35' }} />
            <div>
              <h1 className="title">Contact Management</h1>
              <p className="subtitle">Manage customer inquiries and contact submissions</p>
            </div>
          </div>
          
          <div className="stats">
            <div className="stat-card">
              <MessageSquare size={32} />
              <div>
                <h3 className="stat-number">{contacts.length}</h3>
                <p className="stat-label">Total Contacts</p>
              </div>
            </div>
            <div className="stat-card">
              <Calendar size={32} />
              <div>
                <h3 className="stat-number">
                  {contacts.filter(c => new Date(c.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
                </h3>
                <p className="stat-label">This Week</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls Section */}
        <div className="controls-section">
          <div className="controls">
            <div className="search-container">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            
            <select 
              value={filterBy} 
              onChange={(e) => setFilterBy(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Contacts</option>
              <option value="recent">Recent (7 days)</option>
            </select>
            
            <button onClick={fetchContacts} className="action-button refresh-button">
              <RefreshCw size={18} />
              Refresh
            </button>
            
            <button onClick={exportContacts} className="action-button export-button">
              <Download size={18} />
              Export CSV
            </button>
          </div>
        </div>

        {/* Table */}
        {filteredContacts.length > 0 ? (
          <div className="table-container">
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th><User size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />Name</th>
                  <th><Mail size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />Email</th>
                  <th><Phone size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />Phone</th>
                  <th><MapPin size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />Address</th>
                  <th><MessageSquare size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />Message</th>
                  <th><Calendar size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredContacts.map(contact => (
                  <tr key={contact._id} className="table-row">
                    <td className="table-cell">{contact.name}</td>
                    <td className="table-cell">{contact.email}</td>
                    <td className="table-cell">{contact.phone}</td>
                    <td className="table-cell">{contact.address}</td>
                    <td className="table-cell">
                      <div className="message-preview" title={contact.message}>
                        {contact.message}
                      </div>
                    </td>
                    <td className="table-cell">{new Date(contact.createdAt).toLocaleDateString()}</td>
                    <td className="table-cell">
                      <div className="action-buttons">
                        <button 
                          onClick={() => { setSelectedContact(contact); setShowModal(true); }}
                          className="view-button"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          onClick={() => deleteContact(contact._id)}
                          className="delete-button"
                          title="Delete Contact"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <MessageSquare size={64} className="empty-icon" />
            <h3>No contacts found</h3>
            <p>No contacts match your current search or filter criteria.</p>
          </div>
        )}

        {/* Modal */}
        {showModal && selectedContact && (
          <div className="modal" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">Contact Details</h2>
                <button onClick={() => setShowModal(false)} className="close-button">×</button>
              </div>
              
              <div className="contact-detail">
                <User className="detail-icon" size={20} />
                <div className="detail-content">
                  <h4>Name</h4>
                  <p>{selectedContact.name}</p>
                </div>
              </div>
              
              <div className="contact-detail">
                <Mail className="detail-icon" size={20} />
                <div className="detail-content">
                  <h4>Email</h4>
                  <p>{selectedContact.email}</p>
                </div>
              </div>
              
              <div className="contact-detail">
                <Phone className="detail-icon" size={20} />
                <div className="detail-content">
                  <h4>Phone</h4>
                  <p>{selectedContact.phone}</p>
                </div>
              </div>
              
              <div className="contact-detail">
                <MapPin className="detail-icon" size={20} />
                <div className="detail-content">
                  <h4>Address</h4>
                  <p>{selectedContact.address}</p>
                </div>
              </div>
              
              <div className="contact-detail">
                <MessageSquare className="detail-icon" size={20} />
                <div className="detail-content">
                  <h4>Message</h4>
                  <p>{selectedContact.message}</p>
                </div>
              </div>
              
              <div className="contact-detail">
                <Calendar className="detail-icon" size={20} />
                <div className="detail-content">
                  <h4>Submitted On</h4>
                  <p>{new Date(selectedContact.createdAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}