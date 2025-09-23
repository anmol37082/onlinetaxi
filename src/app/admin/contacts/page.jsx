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
import styles from "./AdminContacts.module.css";
import AdminAuthWrapper from "../../components/AdminAuthWrapper";


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
      <AdminAuthWrapper>
        <div className={styles.container}>
          <div className={styles.heroBgPattern}></div>
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Loading contacts...</p>
          </div>
        </div>
      </AdminAuthWrapper>
    );
  }

  return (
    <AdminAuthWrapper>
      <div className={styles.container}>
        <div className={styles.heroBgPattern}></div>

        {/* Header Section */}
        <div className={styles.header}>
          <div className={styles.headerTop}>
            <a href="/admin" className={styles.backButton}>
              <i className="fas fa-arrow-left"></i>
              Back to Admin Panel
            </a>
          </div>
          <h1 className={styles.title}>Contact Management</h1>
          <p className={styles.subtitle}>Manage customer inquiries and contact submissions</p>
        </div>

        {/* Stats Section */}
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <MessageSquare size={20} />
            </div>
            <h3 className={styles.statNumber}>{contacts.length}</h3>
            <p className={styles.statLabel}>Total Contacts</p>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <Calendar size={20} />
            </div>
            <h3 className={styles.statNumber}>
              {contacts.filter(c => new Date(c.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
            </h3>
            <p className={styles.statLabel}>This Week</p>
          </div>
        </div>

        {/* Controls Section */}
        <div className={styles.controls}>
          <div className={styles.controlsGrid}>
            <div className={styles.searchContainer}>
              <Search className={styles.searchIcon} size={20} />
              <input
                type="text"
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>

            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">All Contacts</option>
              <option value="recent">Recent (7 days)</option>
            </select>

            <button onClick={fetchContacts} className={`${styles.actionButton} ${styles.refreshButton}`}>
              <RefreshCw size={18} />
              Refresh
            </button>

            <button onClick={exportContacts} className={`${styles.actionButton} ${styles.exportButton}`}>
              <Download size={18} />
              Export CSV
            </button>
          </div>
        </div>

        {/* Table */}
        {filteredContacts.length > 0 ? (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead className={styles.tableHeader}>
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
                  <tr key={contact._id} className={styles.tableRow}>
                    <td className={styles.tableCell}>{contact.name}</td>
                    <td className={styles.tableCell}>{contact.email}</td>
                    <td className={styles.tableCell}>{contact.phone}</td>
                    <td className={styles.tableCell}>{contact.address}</td>
                    <td className={styles.tableCell}>
                      <div className={styles.messagePreview} title={contact.message}>
                        {contact.message}
                      </div>
                    </td>
                    <td className={styles.tableCell}>{new Date(contact.createdAt).toLocaleDateString()}</td>
                    <td className={styles.tableCell}>
                      <div className={styles.actionButtons}>
                        <button
                          onClick={() => { setSelectedContact(contact); setShowModal(true); }}
                          className={styles.viewButton}
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          onClick={() => deleteContact(contact._id)}
                          className={styles.deleteButton}
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
          <div className={styles.emptyState}>
            <MessageSquare size={64} className={styles.emptyIcon} />
            <h3>No contacts found</h3>
            <p>No contacts match your current search or filter criteria.</p>
          </div>
        )}

        {/* Modal */}
        {showModal && selectedContact && (
          <div className={styles.modal} onClick={() => setShowModal(false)}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2 className={styles.modalTitle}>Contact Details</h2>
                <button onClick={() => setShowModal(false)} className={styles.closeButton}>×</button>
              </div>

              <div className={styles.contactDetail}>
                <User className={styles.detailIcon} size={20} />
                <div className={styles.detailContent}>
                  <h4>Name</h4>
                  <p>{selectedContact.name}</p>
                </div>
              </div>

              <div className={styles.contactDetail}>
                <Mail className={styles.detailIcon} size={20} />
                <div className={styles.detailContent}>
                  <h4>Email</h4>
                  <p>{selectedContact.email}</p>
                </div>
              </div>

              <div className={styles.contactDetail}>
                <Phone className={styles.detailIcon} size={20} />
                <div className={styles.detailContent}>
                  <h4>Phone</h4>
                  <p>{selectedContact.phone}</p>
                </div>
              </div>

              <div className={styles.contactDetail}>
                <MapPin className={styles.detailIcon} size={20} />
                <div className={styles.detailContent}>
                  <h4>Address</h4>
                  <p>{selectedContact.address}</p>
                </div>
              </div>

              <div className={styles.contactDetail}>
                <MessageSquare className={styles.detailIcon} size={20} />
                <div className={styles.detailContent}>
                  <h4>Message</h4>
                  <p>{selectedContact.message}</p>
                </div>
              </div>

              <div className={styles.contactDetail}>
                <Calendar className={styles.detailIcon} size={20} />
                <div className={styles.detailContent}>
                  <h4>Submitted On</h4>
                  <p>{new Date(selectedContact.createdAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        )}


      </div>
    </AdminAuthWrapper>
  );
}
