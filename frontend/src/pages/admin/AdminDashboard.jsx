import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

// SAMPLE DATA - So I can see the table populated
const defaultRegistrations = [
  {
    id: "reg_1719942000000",
    name: "Amina Yusuf",
    email: "amina.yusuf@gmail.com",
    phone: "+254 712 345678",
    role: "student",
    date: "2026-07-01",
    status: "approved",
    details: {
      program: "Lumina Mentorship Hub",
      status: "Recent Graduate",
      linkedin: "https://linkedin.com/in/aminayusuf",
      motivation: "I want to transition into UX design. As a recent graduate in computer science, I lack practical portfolio guidance. Having a mentor from a global tech company would help me polish my design processes and prepare for career opportunities."
    }
  },
  {
    id: "reg_1720028400000",
    name: "Dr. Chioma Adebayo",
    email: "chioma.adebayo@unilag.edu.ng",
    phone: "+234 803 123 4567",
    role: "mentor",
    date: "2026-07-02",
    status: "approved",
    details: {
      organization: "University of Lagos",
      website: "https://unilag.edu.ng",
      message: "I am passionate about empowering African young minds in science and tech. I would love to support AfriLumina by mentoring computer science majors, conducting academic workshops, and providing career navigation advisory."
    }
  },
  {
    id: "reg_1720114800000",
    name: "David Mensah",
    email: "d.mensah@outlook.com",
    phone: "+233 24 123 4567",
    role: "volunteer",
    date: "2026-07-03",
    status: "pending",
    details: {
      organization: "",
      website: "https://linkedin.com/in/davidmensah",
      message: "I have 3 years of experience in social media management and community building. I want to volunteer my skills to handle AfriLumina's online presence, write newsletters, and coordinate communication for upcoming events."
    }
  },
  {
    id: "reg_1720201200000",
    name: "Farah Ibrahim",
    email: "farah.ibrahim@strathmore.edu",
    phone: "+254 722 000111",
    role: "student",
    date: "2026-07-04",
    status: "pending",
    details: {
      program: "Skills Accelerator",
      status: "Student",
      linkedin: "",
      motivation: "I want to master web development and software engineering. Strathmore teaches theory, but AfriLumina offers the hands-on project experience that employers actually value. I am eager to learn Git, Node.js, and React."
    }
  },
  {
    id: "reg_1720287600000",
    name: "John Doe / Acme Corp",
    email: "partnerships@acme.com",
    phone: "+1 555 019 2834",
    role: "partner",
    date: "2026-07-05",
    status: "pending",
    details: {
      organization: "Acme Corporation",
      website: "https://acme.com",
      message: "Acme Corp is looking to sponsor African technology cohorts. We are willing to fund the Lumina Mentorship Hub with a Bronze/Silver level tier next year, providing both financial support and direct internship pipelines."
    }
  }
];

const AdminDashboard = () => {
  console.log('✅ AdminDashboard is rendering');

  const { admin } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedReg, setSelectedReg] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState('pending');

  // Load data from localStorage. Now changed to load from Spring Boot API
  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const token = localStorage.getItem('afrilumina_token');
        const response = await fetch('http://localhost:8080/api/registrations', {
          headers: {
            'Authorization': `Bearer ${token}` // Send the token to the backend
          }
        });

        if (response.ok) {
          const data = await response.json();
          setRegistrations(data);
        } else {
          console.error('Failed to fetch registrations from backend');
          // Optional fallback to load from localStorage if backend is down🚶🏿
          loadLocalFallback();
        }
      } catch (error) {
        console.error('API Error:', error);
        loadLocalFallback();
      }
    };

    const loadLocalFallback = () => {
      let data = [];
      try {
        const stored = localStorage.getItem('afrilumina_registrations');
        if (stored) {
          data = JSON.parse(stored);
        } else {
          localStorage.setItem('afrilumina_registrations', JSON.stringify(defaultRegistrations));
          data = defaultRegistrations;
        }
      } catch (e) {
        data = defaultRegistrations;
        localStorage.setItem('afrilumina_registrations', JSON.stringify(defaultRegistrations));
      }
      setRegistrations(data);
    };

    fetchRegistrations();
  }, []);

  // Filter and search
  useEffect(() => {
    let result = registrations;
    if (roleFilter !== 'all') {
      result = result.filter(r => r.role === roleFilter);
    }
    if (statusFilter !== 'all') {
      result = result.filter(r => r.status === statusFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        (r.details?.organization && r.details.organization.toLowerCase().includes(q))
      );
    }
    setFiltered(result);
  }, [registrations, roleFilter, statusFilter, search]);

  // Stats
  const getStats = () => {
    const stats = { students: 0, mentors: 0, volunteers: 0, pending: 0 };
    registrations.forEach(r => {
      if (r.role === 'student') stats.students++;
      else if (r.role === 'mentor') stats.mentors++;
      else if (r.role === 'volunteer') stats.volunteers++;
      if (r.status === 'pending') stats.pending++;
    });
    return stats;
  };
  const stats = getStats();

  // CRUD functions
  const updateStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('afrilumina_token');
      const response = await fetch(`http://localhost:8080/api/registrations/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        // If successful on the server, update the UI to match
        const updated = registrations.map(r =>
          r.id === id ? { ...r, status: newStatus } : r
        );
        setRegistrations(updated);
        localStorage.setItem('afrilumina_registrations', JSON.stringify(updated)); // Keep local in sync
      } else {
        alert('Failed to update status on the server.');
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  //DELETE Request to the server
  const deleteReg = async (id) => {
    if (window.confirm('Are you sure you want to delete this registration?')) {
      try {
        const token = localStorage.getItem('afrilumina_token');
        const response = await fetch(`http://localhost:8080/api/registrations/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          // If successful, remove from UI
          const updated = registrations.filter(r => r.id !== id);
          setRegistrations(updated);
          localStorage.setItem('afrilumina_registrations', JSON.stringify(updated));
          if (selectedReg?.id === id) closeModal();
        } else {
          alert('Failed to delete registration on the server.');
        }
      } catch (error) {
        console.error('Error deleting registration:', error);
      }
    }
  };

  const exportData = () => {
    const dataStr = JSON.stringify(registrations, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `afrilumina_registrations_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  //RESET Data
  const resetData = async () => {
    if (window.confirm('Are you sure you want to reset to default seed data?')) {
      try {
        const token = localStorage.getItem('afrilumina_token');
        // Note: I will need to create a @PostMapping("/api/registrations/seed") in Spring Boot
        const response = await fetch('http://localhost:8080/api/registrations/seed', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const freshData = await response.json();
          setRegistrations(freshData);
          localStorage.setItem('afrilumina_registrations', JSON.stringify(freshData));
        } else {
          alert('Failed to reset data on the server.');
        }
      } catch (error) {
        console.error('Error resetting data:', error);
      }
    }
  };

  const openModal = (reg) => {
    setSelectedReg(reg);
    setModalStatus(reg.status);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedReg(null);
  };

  const saveModalStatus = () => {
    if (selectedReg) {
      updateStatus(selectedReg.id, modalStatus);
      closeModal();
    }
  };

  // Format date
  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch { return dateStr; }
  };

  return (
    <div>
      <div className="admin-page" style={{ paddingTop: '100px' }}>
        <section className="admin-section container">
          <div className="admin-header-block reveal">
            <div>
              <h1>Admin <span>Dashboard</span></h1>
              <p>Monitor registrations, manage applications, and review mentor & volunteer signups.</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="stats-grid reveal">
            <div className="admin-stat-card">
              <div className="stat-icon students"><i className="fa-solid fa-user-graduate"></i></div>
              <div className="stat-info"><h3>{stats.students}</h3><p>Total Students</p></div>
            </div>
            <div className="admin-stat-card">
              <div className="stat-icon mentors"><i className="fa-solid fa-chalkboard-user"></i></div>
              <div className="stat-info"><h3>{stats.mentors}</h3><p>Active Mentors</p></div>
            </div>
            <div className="admin-stat-card">
              <div className="stat-icon volunteers"><i className="fa-solid fa-hand-holding-heart"></i></div>
              <div className="stat-info"><h3>{stats.volunteers}</h3><p>Volunteers</p></div>
            </div>
            <div className="admin-stat-card">
              <div className="stat-icon pending"><i className="fa-solid fa-clock"></i></div>
              <div className="stat-info"><h3>{stats.pending}</h3><p>Pending Actions</p></div>
            </div>
          </div>

          {/* Controls */}
          <div className="admin-controls-card reveal">
            <div className="controls-grid">
              <div className="search-wrapper">
                <i className="fa-solid fa-magnifying-glass"></i>
                <input
                  type="text"
                  placeholder="Search by name, email or keyword..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div>
                <select className="filter-select" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                  <option value="all">All Roles</option>
                  <option value="student">Students</option>
                  <option value="mentor">Mentors</option>
                  <option value="volunteer">Volunteers</option>
                  <option value="partner">Partners</option>
                  <option value="supporter">Supporters</option>
                </select>
              </div>
              <div>
                <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div className="actions-wrapper">
                <button className="admin-btn btn-primary" onClick={exportData}>
                  <i className="fa-solid fa-file-export"></i> Export JSON
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="table-card reveal">
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Registrant Info</th>
                    <th>Role</th>
                    <th>Phone Number</th>
                    <th>Registered Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan="6">
                        <div className="table-empty">
                          <i className="fa-solid fa-folder-open"></i>
                          <h3>No registrations found</h3>
                          <p>Try adjusting your filters or adding sample data.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filtered.map(reg => (
                      <tr key={reg.id}>
                        <td>
                          <div className="user-info">
                            <span className="user-name">{reg.name}</span>
                            <span className="user-email">{reg.email}</span>
                          </div>
                        </td>
                        <td><span className={`role-badge ${reg.role}`}>{reg.role}</span></td>
                        <td><span className="user-phone">{reg.phone}</span></td>
                        <td>{formatDate(reg.date)}</td>
                        <td><span className={`status-badge ${reg.status}`}>{reg.status}</span></td>
                        <td>
                          <div className="row-actions">
                            <button className="action-icon-btn view" onClick={() => openModal(reg)}>
                              <i className="fa-solid fa-eye"></i>
                            </button>
                            {reg.status === 'pending' && (
                              <>
                                <button className="action-icon-btn approve" onClick={() => updateStatus(reg.id, 'approved')}>
                                  <i className="fa-solid fa-check"></i>
                                </button>
                                <button className="action-icon-btn reject" onClick={() => updateStatus(reg.id, 'rejected')}>
                                  <i className="fa-solid fa-xmark"></i>
                                </button>
                              </>
                            )}
                            <button className="action-icon-btn delete" onClick={() => deleteReg(reg.id)}>
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Database Settings */}
          <div className="database-settings-card reveal">
            <div className="settings-info">
              <h4>System Database Controls</h4>
              <p>Manage system state. Resetting will restore default mock applicants and clear manual signups.</p>
            </div>
            <div className="settings-actions">
              <button className="admin-btn btn-danger-outline" onClick={resetData}>
                <i className="fa-solid fa-rotate-left"></i> Reset Database
              </button>
            </div>
          </div>
        </section>

        {/* Modal */}
        {modalOpen && selectedReg && (
          <div className="modal active" id="adminDetailsModal">
            <div className="modal-overlay" onClick={closeModal}></div>
            <div className="modal-card" style={{ maxWidth: '650px' }}>
              <button className="close-modal-btn" onClick={closeModal}>
                <i className="fa-solid fa-xmark"></i>
              </button>
              <div className="modal-header">
                <h2>Review Registration</h2>
                <p>Manage application status and review submission details for <strong>{selectedReg.name}</strong>.</p>
              </div>
              <div className="admin-modal-details">
                <div className="details-grid">
                  <div className="detail-item">
                    <label>Registration ID</label>
                    <span>{selectedReg.id}</span>
                  </div>
                  <div className="detail-item">
                    <label>Registration Date</label>
                    <span>{selectedReg.date}</span>
                  </div>
                  <div className="detail-item">
                    <label>Role Type</label>
                    <span className={`role-badge ${selectedReg.role}`}>{selectedReg.role}</span>
                  </div>
                  <div className="detail-item">
                    <label>Email Address</label>
                    <span>{selectedReg.email}</span>
                  </div>
                  {selectedReg.role === 'student' && (
                    <>
                      <div className="detail-item">
                        <label>Program of Interest</label>
                        <span>{selectedReg.details?.program}</span>
                      </div>
                      <div className="detail-item">
                        <label>Current Status</label>
                        <span>{selectedReg.details?.status}</span>
                      </div>
                      <div className="detail-item full-width">
                        <label>Motivation</label>
                        <p>{selectedReg.details?.motivation}</p>
                      </div>
                    </>
                  )}
                  {['mentor', 'volunteer', 'partner'].includes(selectedReg.role) && (
                    <>
                      <div className="detail-item">
                        <label>Organization</label>
                        <span>{selectedReg.details?.organization}</span>
                      </div>
                      <div className="detail-item">
                        <label>Website</label>
                        <span>{selectedReg.details?.website}</span>
                      </div>
                      <div className="detail-item full-width">
                        <label>Message</label>
                        <p>{selectedReg.details?.message}</p>
                      </div>
                    </>
                  )}
                </div>
                <div className="form-group" style={{ marginTop: '20px' }}>
                  <label style={{ display: 'block', fontWeight: 600 }}>Update Application Status</label>
                  <select
                    className="filter-select"
                    value={modalStatus}
                    onChange={(e) => setModalStatus(e.target.value)}
                    style={{ maxWidth: '250px' }}
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
              <div className="modal-actions-panel">
                <button className="admin-btn btn-outline" onClick={closeModal}>Close</button>
                <button className="admin-btn btn-primary" onClick={saveModalStatus}>
                  <i className="fa-solid fa-save"></i> Save Status
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;