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

  return (
    <div>
      <h2>Admin Dashboard</h2>
      
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button onClick={() => setActiveTab('dashboard')}>Dashboard</button>
        <button onClick={() => setActiveTab('users')}>Manage Users</button>
        <button onClick={() => setActiveTab('stores')}>Manage Stores</button>
        <button onClick={() => setActiveTab('addUser')}>Add User</button>
        <button onClick={() => setActiveTab('addStore')}>Add Store</button>
      </div>

      {activeTab === 'dashboard' && (
        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h3>Total Users</h3>
            <p style={{ fontSize: '24px' }}>{stats.totalUsers}</p>
          </div>
          <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h3>Total Stores</h3>
            <p style={{ fontSize: '24px' }}>{stats.totalStores}</p>
          </div>
          <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h3>Total Ratings</h3>
            <p style={{ fontSize: '24px' }}>{stats.totalRatings}</p>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div>
          <h3>User Directory</h3>
          <div style={{ marginBottom: '15px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <input name="name" placeholder="Filter by Name" value={userFilters.name} onChange={handleUserFilterChange} />
            <input name="email" placeholder="Filter by Email" value={userFilters.email} onChange={handleUserFilterChange} />
            <input name="address" placeholder="Filter by Address" value={userFilters.address} onChange={handleUserFilterChange} />
            <select name="role" value={userFilters.role} onChange={handleUserFilterChange}>
              <option value="">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="USER">User</option>
              <option value="STORE_OWNER">Store Owner</option>
            </select>
          </div>
          
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f5f5f5', textAlign: 'left' }}>
                <th onClick={() => handleUserSort('name')} style={{ cursor: 'pointer', padding: '10px', borderBottom: '1px solid #ddd' }}>Name</th>
                <th onClick={() => handleUserSort('email')} style={{ cursor: 'pointer', padding: '10px', borderBottom: '1px solid #ddd' }}>Email</th>
                <th onClick={() => handleUserSort('address')} style={{ cursor: 'pointer', padding: '10px', borderBottom: '1px solid #ddd' }}>Address</th>
                <th onClick={() => handleUserSort('role')} style={{ cursor: 'pointer', padding: '10px', borderBottom: '1px solid #ddd' }}>Role</th>
                <th onClick={() => handleUserSort('store_rating')} style={{ cursor: 'pointer', padding: '10px', borderBottom: '1px solid #ddd' }}>Store Rating</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{u.name}</td>
                  <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{u.email}</td>
                  <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{u.address}</td>
                  <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{u.role}</td>
                  <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                    {u.role === 'STORE_OWNER' ? (u.store_rating ? Number(u.store_rating).toFixed(1) : 'No ratings') : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'stores' && (
        <div>
          <h3>Store Directory</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f5f5f5', textAlign: 'left' }}>
                <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Name</th>
                <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Email</th>
                <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Address</th>
                <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Average Rating</th>
              </tr>
            </thead>
            <tbody>
              {stores.map(s => (
                <tr key={s.id}>
                  <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{s.name}</td>
                  <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{s.email}</td>
                  <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{s.address}</td>
                  <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{Number(s.average_rating).toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'addUser' && (
        <form onSubmit={handleAddUser} style={{ maxWidth: '400px' }}>
          <h3>Add New User</h3>
          <input type="text" placeholder="Name" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} required minLength={20} maxLength={60} style={{ width: '100%', marginBottom: '10px', padding: '8px' }} />
          <input type="email" placeholder="Email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} required style={{ width: '100%', marginBottom: '10px', padding: '8px' }} />
          <input type="password" placeholder="Password" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} required minLength={8} maxLength={16} style={{ width: '100%', marginBottom: '10px', padding: '8px' }} />
          <textarea placeholder="Address" value={newUser.address} onChange={e => setNewUser({...newUser, address: e.target.value})} required maxLength={400} style={{ width: '100%', marginBottom: '10px', padding: '8px' }} />
          <select value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})} style={{ width: '100%', marginBottom: '10px', padding: '8px' }}>
            <option value="USER">Normal User</option>
            <option value="STORE_OWNER">Store Owner</option>
            <option value="ADMIN">System Administrator</option>
          </select>
          <button type="submit" style={{ padding: '10px 15px' }}>Create User</button>
        </form>
      )}

      {activeTab === 'addStore' && (
        <form onSubmit={handleAddStore} style={{ maxWidth: '400px' }}>
          <h3>Add New Store</h3>
          <input type="text" placeholder="Store Name" value={newStore.name} onChange={e => setNewStore({...newStore, name: e.target.value})} required maxLength={60} style={{ width: '100%', marginBottom: '10px', padding: '8px' }} />
          <input type="email" placeholder="Store Email" value={newStore.email} onChange={e => setNewStore({...newStore, email: e.target.value})} required style={{ width: '100%', marginBottom: '10px', padding: '8px' }} />
          <textarea placeholder="Store Address" value={newStore.address} onChange={e => setNewStore({...newStore, address: e.target.value})} required maxLength={400} style={{ width: '100%', marginBottom: '10px', padding: '8px' }} />
          <select value={newStore.owner_id} onChange={e => setNewStore({...newStore, owner_id: e.target.value})} required style={{ width: '100%', marginBottom: '10px', padding: '8px' }}>
            <option value="">Select Store Owner</option>
            {owners.map(owner => (
              <option key={owner.id} value={owner.id}>{owner.name} ({owner.email})</option>
            ))}
          </select>
          <button type="submit" style={{ padding: '10px 15px' }}>Create Store</button>
        </form>
      )}
    </div>
  );
};

export default AdminDashboard;