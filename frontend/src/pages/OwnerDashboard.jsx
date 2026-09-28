import { useState, useEffect } from 'react';
import api from '../api/axios';

const OwnerDashboard = () => {
  const [data, setData] = useState(null);
  const [replyInputs, setReplyInputs] = useState({});
  const [passwordData, setPasswordData] = useState({ newPassword: '' });
  const [passwordMessage, setPasswordMessage] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/ratings/owner/dashboard');
      setData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleReplyChange = (ratingId, text) => {
    setReplyInputs({ ...replyInputs, [ratingId]: text });
  };

  const submitReply = async (ratingId) => {
    try {
      const reply = replyInputs[ratingId];
      await api.post(`/ratings/reply/${ratingId}`, { reply });
      alert('Reply posted successfully');
      fetchDashboardData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to post reply');
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put('/auth/password', passwordData);
      setPasswordMessage('Password updated successfully');
      setPasswordData({ newPassword: '' });
    } catch (error) {
      setPasswordMessage(error.response?.data?.errors?.[0]?.msg || error.response?.data?.message || 'Failed to update password');
    }
  };

  if (!data) return <div>Loading dashboard...</div>;

  return (
    <div>
      <h2>{data.store.name} - Owner Dashboard</h2>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', flex: 1 }}>
          <h3>Average Rating</h3>
          <p style={{ fontSize: '32px', margin: '10px 0' }}>
            {Number(data.averageRating).toFixed(1)} / 5
          </p>
          <p>Total Ratings: {data.totalRatings}</p>
        </div>

        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', flex: 1 }}>
          <h3>Rating Distribution</h3>
          {data.ratingDistribution.map(dist => (
            <div key={dist.rating} style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>{dist.rating} Stars:</span>
              <span>{dist.count}</span>
            </div>
          ))}
        </div>
        
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', flex: 1 }}>
          <h3>Update Password</h3>
          <form onSubmit={handlePasswordUpdate}>
            <input 
              type="password" 
              placeholder="New Password" 
              value={passwordData.newPassword} 
              onChange={e => setPasswordData({ newPassword: e.target.value })} 
              required 
              minLength={8}
              maxLength={16}
              style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
            />
            <button type="submit" style={{ width: '100%', padding: '8px' }}>Update</button>
          </form>
          {passwordMessage && <p style={{ marginTop: '10px', fontSize: '14px', color: passwordMessage.includes('success') ? 'green' : 'red' }}>{passwordMessage}</p>}
        </div>
      </div>

      <h3>Customer Ratings</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f5f5f5', textAlign: 'left' }}>
            <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Customer Name</th>
            <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Email</th>
            <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Rating</th>
            <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Date</th>
            <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Your Response</th>
          </tr>
        </thead>
        <tbody>
          {data.raters.map(rater => (
            <tr key={rater.rating_id}>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{rater.name}</td>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{rater.email}</td>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>{rater.rating} / 5</td>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                {new Date(rater.created_at).toLocaleDateString()}
              </td>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                {rater.owner_reply ? (
                  <div>
                    <p style={{ margin: '0 0 5px 0', fontStyle: 'italic', color: '#555' }}>"{rater.owner_reply}"</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <input 
                      type="text" 
                      placeholder="Type a reply..." 
                      value={replyInputs[rater.rating_id] || ''} 
                      onChange={(e) => handleReplyChange(rater.rating_id, e.target.value)}
                      style={{ padding: '5px', flex: 1 }}
                    />
                    <button onClick={() => submitReply(rater.rating_id)} style={{ padding: '5px 10px' }}>Reply</button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OwnerDashboard;