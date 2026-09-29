import { useState, useEffect } from 'react';
import api from '../api/axios';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [userFilters, setUserFilters] = useState({ name: '', email: '', address: '', role: '', sortField: 'name', sortOrder: 'ASC' });
  
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', address: '', role: 'USER' });
  const [newStore, setNewStore] = useState({ name: '', email: '', address: '', owner_id: '' });
  const [owners, setOwners] = useState([]);

  useEffect(() => {
    fetchStats();
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'stores') fetchStores();
    if (activeTab === 'addStore') fetchOwners();
  }, [activeTab, userFilters]);

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/dashboard');
      setStats(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams(userFilters).toString();
      const response = await api.get(`/admin/users?${params}`);
      setUsers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchStores = async () => {
    try {
      const response = await api.get('/stores');
      setStores(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchOwners = async () => {
    try {
      const response = await api.get('/admin/users?role=STORE_OWNER');
      setOwners(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUserFilterChange = (e) => {
    setUserFilters({ ...userFilters, [e.target.name]: e.target.value });
  };

  const handleUserSort = (field) => {
    const order = userFilters.sortField === field && userFilters.sortOrder === 'ASC' ? 'DESC' : 'ASC';
    setUserFilters({ ...userFilters, sortField: field, sortOrder: order });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/users', newUser);
      alert('User added successfully');
      setNewUser({ name: '', email: '', password: '', address: '', role: 'USER' });
      fetchStats();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add user');
    }
  };

  const handleAddStore = async (e) => {
    e.preventDefault();
    try {
      await api.post('/stores', newStore);
      alert('Store added successfully');
      setNewStore({ name: '', email: '', address: '', owner_id: '' });
      fetchStats();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add store');
    }
  };

  const styles = {
    container: {
      padding: '30px 40px',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      color: '#334155',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0f8ff 0%, #e0f2fe 100%)'
    },
    heading: {
      fontSize: '1.8rem',
      fontWeight: '500',
      marginBottom: '24px',
      color: '#0f172a',
      letterSpacing: '0.5px'
    },
    subHeading: {
      fontSize: '1.2rem',
      fontWeight: '500',
      marginBottom: '16px',
      color: '#1e293b'
    },
    tabContainer: {
      display: 'flex',
      gap: '12px',
      marginBottom: '30px',
      flexWrap: 'wrap'
    },
    tabButton: (isActive) => ({
      padding: '10px 24px',
      borderRadius: '30px',
      border: isActive ? '1px solid rgba(2, 132, 199, 0.4)' : '1px solid rgba(255, 255, 255, 0.6)',
      background: isActive ? 'rgba(2, 132, 199, 0.1)' : 'rgba(255, 255, 255, 0.5)',
      color: isActive ? '#0284c7' : '#475569',
      fontSize: '0.95rem',
      fontWeight: isActive ? '500' : '400',
      cursor: 'pointer',
      backdropFilter: 'blur(8px)',
      boxShadow: isActive ? '0 4px 12px rgba(2, 132, 199, 0.05)' : 'none',
      transition: 'all 0.2s ease'
    }),
    statsContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '24px'
    },
    statCard: {
      padding: '24px',
      background: 'rgba(255, 255, 255, 0.6)',
      backdropFilter: 'blur(12px)',
      borderRadius: '16px',
      border: '1px solid rgba(255, 255, 255, 0.9)',
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.04)'
    },
    statTitle: {
      margin: '0 0 12px 0',
      fontSize: '1rem',
      color: '#64748b',
      fontWeight: '400'
    },
    statValue: {
      margin: 0,
      fontSize: '2.5rem',
      fontWeight: '600',
      color: '#0284c7'
    },
    glassBox: {
      background: 'rgba(255, 255, 255, 0.55)',
      backdropFilter: 'blur(12px)',
      borderRadius: '16px',
      border: '1px solid rgba(255, 255, 255, 0.8)',
      padding: '24px',
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.04)',
      overflowX: 'auto'
    },
    filterContainer: {
      display: 'flex',
      gap: '12px',
      marginBottom: '20px',
      flexWrap: 'wrap'
    },
    input: {
      padding: '10px 16px',
      borderRadius: '12px',
      border: '1px solid rgba(186, 230, 253, 0.8)',
      background: 'rgba(255, 255, 255, 0.8)',
      color: '#334155',
      fontSize: '0.9rem',
      outline: 'none',
      width: '100%',
      boxSizing: 'border-box'
    },
    filterInput: {
      padding: '10px 16px',
      borderRadius: '12px',
      border: '1px solid rgba(186, 230, 253, 0.8)',
      background: 'rgba(255, 255, 255, 0.8)',
      color: '#334155',
      fontSize: '0.9rem',
      outline: 'none',
      minWidth: '200px',
      flex: 1
    },
    table: {
      width: '100%',
      borderCollapse: 'separate',
      borderSpacing: '0'
    },
    th: {
      padding: '16px',
      textAlign: 'left',
      fontWeight: '500',
      color: '#0284c7',
      background: 'rgba(224, 242, 254, 0.6)',
      borderBottom: '2px solid rgba(186, 230, 253, 0.8)',
      cursor: 'pointer',
      fontSize: '0.95rem'
    },
    td: {
      padding: '16px',
      borderBottom: '1px solid rgba(186, 230, 253, 0.4)',
      color: '#475569',
      fontSize: '0.95rem'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      maxWidth: '450px'
    },
    submitButton: {
      padding: '12px',
      borderRadius: '12px',
      border: 'none',
      background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
      color: '#ffffff',
      fontSize: '1rem',
      fontWeight: '500',
      cursor: 'pointer',
      boxShadow: '0 4px 12px rgba(2, 132, 199, 0.2)',
      marginTop: '8px'
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Admin Dashboard</h2>
      
      <div style={styles.tabContainer}>
        <button style={styles.tabButton(activeTab === 'dashboard')} onClick={() => setActiveTab('dashboard')}>Dashboard</button>
        <button style={styles.tabButton(activeTab === 'users')} onClick={() => setActiveTab('users')}>Manage Users</button>
        <button style={styles.tabButton(activeTab === 'stores')} onClick={() => setActiveTab('stores')}>Manage Stores</button>
        <button style={styles.tabButton(activeTab === 'addUser')} onClick={() => setActiveTab('addUser')}>Add User</button>
        <button style={styles.tabButton(activeTab === 'addStore')} onClick={() => setActiveTab('addStore')}>Add Store</button>
      </div>

      {activeTab === 'dashboard' && (
        <div style={styles.statsContainer}>
          <div style={styles.statCard}>
            <h3 style={styles.statTitle}>Total Users</h3>
            <p style={styles.statValue}>{stats.totalUsers}</p>
          </div>
          <div style={styles.statCard}>
            <h3 style={styles.statTitle}>Total Stores</h3>
            <p style={styles.statValue}>{stats.totalStores}</p>
          </div>
          <div style={styles.statCard}>
            <h3 style={styles.statTitle}>Total Ratings</h3>
            <p style={styles.statValue}>{stats.totalRatings}</p>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div style={styles.glassBox}>
          <h3 style={styles.subHeading}>User Directory</h3>
          <div style={styles.filterContainer}>
            <input style={styles.filterInput} name="name" placeholder="Filter by Name" value={userFilters.name} onChange={handleUserFilterChange} />
            <input style={styles.filterInput} name="email" placeholder="Filter by Email" value={userFilters.email} onChange={handleUserFilterChange} />
            <input style={styles.filterInput} name="address" placeholder="Filter by Address" value={userFilters.address} onChange={handleUserFilterChange} />
            <select style={styles.filterInput} name="role" value={userFilters.role} onChange={handleUserFilterChange}>
              <option value="">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="USER">User</option>
              <option value="STORE_OWNER">Store Owner</option>
            </select>
          </div>
          
          <table style={styles.table}>
            <thead>
              <tr>
                <th onClick={() => handleUserSort('name')} style={styles.th}>Name</th>
                <th onClick={() => handleUserSort('email')} style={styles.th}>Email</th>
                <th onClick={() => handleUserSort('address')} style={styles.th}>Address</th>
                <th onClick={() => handleUserSort('role')} style={styles.th}>Role</th>
                <th onClick={() => handleUserSort('store_rating')} style={{...styles.th, borderRadius: '0 12px 0 0'}}>Store Rating</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td style={styles.td}>{u.name}</td>
                  <td style={styles.td}>{u.email}</td>
                  <td style={styles.td}>{u.address}</td>
                  <td style={styles.td}>{u.role}</td>
                  <td style={styles.td}>
                    {u.role === 'STORE_OWNER' ? (u.store_rating ? Number(u.store_rating).toFixed(1) : 'No ratings') : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'stores' && (
        <div style={styles.glassBox}>
          <h3 style={styles.subHeading}>Store Directory</h3>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Address</th>
                <th style={{...styles.th, borderRadius: '0 12px 0 0'}}>Average Rating</th>
              </tr>
            </thead>
            <tbody>
              {stores.map(s => (
                <tr key={s.id}>
                  <td style={styles.td}>{s.name}</td>
                  <td style={styles.td}>{s.email}</td>
                  <td style={styles.td}>{s.address}</td>
                  <td style={styles.td}>{Number(s.average_rating).toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'addUser' && (
        <div style={styles.glassBox}>
          <form onSubmit={handleAddUser} style={styles.form}>
            <h3 style={styles.subHeading}>Add New User</h3>
            <input type="text" placeholder="Name" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} required minLength={20} maxLength={60} style={styles.input} />
            <input type="email" placeholder="Email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} required style={styles.input} />
            <input type="password" placeholder="Password" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} required minLength={8} maxLength={16} style={styles.input} />
            <textarea placeholder="Address" value={newUser.address} onChange={e => setNewUser({...newUser, address: e.target.value})} required maxLength={400} style={{...styles.input, minHeight: '100px', resize: 'vertical'}} />
            <select value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})} style={styles.input}>
              <option value="USER">Normal User</option>
              <option value="STORE_OWNER">Store Owner</option>
              <option value="ADMIN">System Administrator</option>
            </select>
            <button type="submit" style={styles.submitButton}>Create User</button>
          </form>
        </div>
      )}

      {activeTab === 'addStore' && (
        <div style={styles.glassBox}>
          <form onSubmit={handleAddStore} style={styles.form}>
            <h3 style={styles.subHeading}>Add New Store</h3>
            <input type="text" placeholder="Store Name" value={newStore.name} onChange={e => setNewStore({...newStore, name: e.target.value})} required maxLength={60} style={styles.input} />
            <input type="email" placeholder="Store Email" value={newStore.email} onChange={e => setNewStore({...newStore, email: e.target.value})} required style={styles.input} />
            <textarea placeholder="Store Address" value={newStore.address} onChange={e => setNewStore({...newStore, address: e.target.value})} required maxLength={400} style={{...styles.input, minHeight: '100px', resize: 'vertical'}} />
            <select value={newStore.owner_id} onChange={e => setNewStore({...newStore, owner_id: e.target.value})} required style={styles.input}>
              <option value="">Select Store Owner</option>
              {owners.map(owner => (
                <option key={owner.id} value={owner.id}>{owner.name} ({owner.email})</option>
              ))}
            </select>
            <button type="submit" style={styles.submitButton}>Create Store</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;