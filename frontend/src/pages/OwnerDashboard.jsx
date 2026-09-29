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

  const styles = {
    container: {
      padding: '30px 40px',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      color: '#334155',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0f8ff 0%, #e0f2fe 100%)',
      boxSizing: 'border-box'
    },
    heading: {
      fontSize: '1.8rem',
      fontWeight: '600',
      marginBottom: '24px',
      color: '#0f172a',
      letterSpacing: '0.5px'
    },
    subHeading: {
      fontSize: '1.3rem',
      fontWeight: '500',
      marginBottom: '16px',
      color: '#0369a1'
    },
    cardsWrapper: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '24px',
      marginBottom: '32px'
    },
    card: {
      padding: '24px',
      background: 'rgba(255, 255, 255, 0.55)',
      backdropFilter: 'blur(12px)',
      borderRadius: '16px',
      border: '1px solid rgba(255, 255, 255, 0.9)',
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.04)',
      display: 'flex',
      flexDirection: 'column'
    },
    cardTitle: {
      margin: '0 0 16px 0',
      fontSize: '1.1rem',
      color: '#0284c7',
      fontWeight: '500'
    },
    ratingValue: {
      fontSize: '2.8rem',
      fontWeight: '600',
      color: '#0369a1',
      margin: '0 0 8px 0'
    },
    ratingTotal: {
      margin: 0,
      color: '#475569',
      fontSize: '0.95rem'
    },
    distRow: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '10px 0',
      borderBottom: '1px solid rgba(186, 230, 253, 0.4)',
      color: '#475569',
      fontSize: '0.95rem'
    },
    passwordForm: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      borderRadius: '12px',
      border: '1px solid rgba(186, 230, 253, 0.8)',
      background: 'rgba(255, 255, 255, 0.8)',
      color: '#0f172a',
      fontSize: '0.95rem',
      outline: 'none',
      boxSizing: 'border-box'
    },
    button: {
      padding: '10px 20px',
      borderRadius: '12px',
      border: 'none',
      background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
      color: '#ffffff',
      fontSize: '0.95rem',
      fontWeight: '500',
      cursor: 'pointer',
      boxShadow: '0 4px 12px rgba(2, 132, 199, 0.2)',
      transition: 'all 0.2s',
      whiteSpace: 'nowrap'
    },
    fullButton: {
      width: '100%',
      padding: '12px 20px',
      borderRadius: '12px',
      border: 'none',
      background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
      color: '#ffffff',
      fontSize: '0.95rem',
      fontWeight: '500',
      cursor: 'pointer',
      boxShadow: '0 4px 12px rgba(2, 132, 199, 0.2)'
    },
    message: (isSuccess) => ({
      marginTop: '12px',
      fontSize: '0.9rem',
      color: isSuccess ? '#059669' : '#e11d48',
      background: isSuccess ? 'rgba(209, 250, 229, 0.6)' : 'rgba(255, 228, 230, 0.6)',
      padding: '10px',
      borderRadius: '8px',
      border: `1px solid ${isSuccess ? 'rgba(167, 243, 208, 0.8)' : 'rgba(254, 205, 211, 0.8)'}`
    }),
    tableContainer: {
      background: 'rgba(255, 255, 255, 0.55)',
      backdropFilter: 'blur(12px)',
      borderRadius: '16px',
      border: '1px solid rgba(255, 255, 255, 0.8)',
      padding: '24px',
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.04)',
      overflowX: 'auto'
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
      fontSize: '0.95rem'
    },
    td: {
      padding: '16px',
      borderBottom: '1px solid rgba(186, 230, 253, 0.4)',
      color: '#475569',
      fontSize: '0.95rem'
    },
    boldCell: {
      padding: '16px',
      borderBottom: '1px solid rgba(186, 230, 253, 0.4)',
      color: '#0369a1',
      fontWeight: '600',
      fontSize: '0.95rem'
    },
    replyWrapper: {
      display: 'flex',
      gap: '8px',
      alignItems: 'center'
    },
    replyText: {
      margin: 0,
      fontStyle: 'italic',
      color: '#0369a1',
      background: 'rgba(224, 242, 254, 0.4)',
      padding: '10px 14px',
      borderRadius: '10px',
      border: '1px solid rgba(186, 230, 253, 0.6)',
      fontSize: '0.9rem'
    }
  };

  if (!data) return <div style={styles.container}><h2 style={styles.heading}>Loading dashboard...</h2></div>;

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>{data.store.name} - Owner Dashboard</h2>

      <div style={styles.cardsWrapper}>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Average Rating</h3>
          <p style={styles.ratingValue}>
            {Number(data.averageRating).toFixed(1)} / 5
          </p>
          <p style={styles.ratingTotal}>Total Ratings: {data.totalRatings}</p>
        </div>

        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Rating Distribution</h3>
          {data.ratingDistribution.map(dist => (
            <div key={dist.rating} style={styles.distRow}>
              <span>{dist.rating} Stars:</span>
              <span>{dist.count}</span>
            </div>
          ))}
        </div>
        
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Update Password</h3>
          <form onSubmit={handlePasswordUpdate} style={styles.passwordForm}>
            <input 
              type="password" 
              placeholder="New Password" 
              value={passwordData.newPassword} 
              onChange={e => setPasswordData({ newPassword: e.target.value })} 
              required 
              minLength={8}
              maxLength={16}
              style={styles.input}
            />
            <button type="submit" style={styles.fullButton}>Update Password</button>
          </form>
          {passwordMessage && (
            <p style={styles.message(passwordMessage.includes('success'))}>
              {passwordMessage}
            </p>
          )}
        </div>
      </div>

      <div style={styles.tableContainer}>
        <h3 style={styles.subHeading}>Customer Ratings</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={{...styles.th, borderRadius: '12px 0 0 0'}}>Customer Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Rating</th>
              <th style={styles.th}>Date</th>
              <th style={{...styles.th, borderRadius: '0 12px 0 0'}}>Your Response</th>
            </tr>
          </thead>
          <tbody>
            {data.raters.map(rater => (
              <tr key={rater.rating_id}>
                <td style={styles.td}>{rater.name}</td>
                <td style={styles.td}>{rater.email}</td>
                <td style={styles.boldCell}>{rater.rating} / 5</td>
                <td style={styles.td}>
                  {new Date(rater.created_at).toLocaleDateString()}
                </td>
                <td style={styles.td}>
                  {rater.owner_reply ? (
                    <p style={styles.replyText}>"{rater.owner_reply}"</p>
                  ) : (
                    <div style={styles.replyWrapper}>
                      <input 
                        type="text" 
                        placeholder="Type a reply..." 
                        value={replyInputs[rater.rating_id] || ''} 
                        onChange={(e) => handleReplyChange(rater.rating_id, e.target.value)}
                        style={{...styles.input, padding: '10px 14px'}}
                      />
                      <button onClick={() => submitReply(rater.rating_id)} style={styles.button}>Reply</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OwnerDashboard;