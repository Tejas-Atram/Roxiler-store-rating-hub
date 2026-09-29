import { useState, useEffect } from 'react';
import api from '../api/axios';

const UserDashboard = () => {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: '', address: '' });
  const [ratingInputs, setRatingInputs] = useState({});

  useEffect(() => {
    fetchStores();
  }, [filters]);

  const fetchStores = async () => {
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await api.get(`/stores?${params}`);
      setStores(response.data);
      
      const initialRatings = {};
      response.data.forEach(store => {
        initialRatings[store.id] = store.user_submitted_rating || 5;
      });
      setRatingInputs(initialRatings);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleRatingChange = (storeId, value) => {
    setRatingInputs({ ...ratingInputs, [storeId]: value });
  };

  const submitRating = async (storeId) => {
    try {
      const rating = ratingInputs[storeId];
      await api.post(`/ratings/${storeId}`, { rating });
      alert('Rating submitted successfully');
      fetchStores();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit rating');
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
    filterContainer: {
      display: 'flex',
      gap: '16px',
      marginBottom: '24px',
      flexWrap: 'wrap'
    },
    input: {
      flex: 1,
      minWidth: '250px',
      padding: '12px 16px',
      borderRadius: '12px',
      border: '1px solid rgba(186, 230, 253, 0.8)',
      background: 'rgba(255, 255, 255, 0.8)',
      color: '#0f172a',
      fontSize: '0.95rem',
      outline: 'none',
      boxSizing: 'border-box'
    },
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
      fontSize: '0.95rem',
      verticalAlign: 'middle'
    },
    ratingText: {
      fontWeight: '600',
      color: '#0369a1'
    },
    actionWrapper: {
      display: 'flex',
      gap: '12px',
      alignItems: 'center'
    },
    select: {
      padding: '10px 14px',
      borderRadius: '10px',
      border: '1px solid rgba(186, 230, 253, 0.8)',
      background: 'rgba(255, 255, 255, 0.9)',
      color: '#0f172a',
      fontSize: '0.9rem',
      outline: 'none',
      cursor: 'pointer'
    },
    button: {
      padding: '10px 16px',
      borderRadius: '10px',
      border: 'none',
      background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
      color: '#ffffff',
      fontSize: '0.9rem',
      fontWeight: '500',
      cursor: 'pointer',
      boxShadow: '0 4px 12px rgba(2, 132, 199, 0.2)',
      whiteSpace: 'nowrap'
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>User Dashboard</h2>
      
      <div style={styles.filterContainer}>
        <input 
          name="name" 
          placeholder="Search by Store Name" 
          value={filters.name} 
          onChange={handleFilterChange} 
          style={styles.input}
        />
        <input 
          name="address" 
          placeholder="Search by Address" 
          value={filters.address} 
          onChange={handleFilterChange} 
          style={styles.input}
        />
      </div>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={{...styles.th, borderRadius: '12px 0 0 0'}}>Store Name</th>
              <th style={styles.th}>Address</th>
              <th style={styles.th}>Overall Rating</th>
              <th style={styles.th}>Your Rating</th>
              <th style={{...styles.th, borderRadius: '0 12px 0 0'}}>Action</th>
            </tr>
          </thead>
          <tbody>
            {stores.map(store => (
              <tr key={store.id}>
                <td style={styles.td}>{store.name}</td>
                <td style={styles.td}>{store.address}</td>
                <td style={{...styles.td, ...styles.ratingText}}>
                  {Number(store.average_rating).toFixed(1)} / 5
                </td>
                <td style={styles.td}>
                  {store.user_submitted_rating ? (
                    <span style={styles.ratingText}>{store.user_submitted_rating} / 5</span>
                  ) : (
                    'Not rated yet'
                  )}
                </td>
                <td style={styles.td}>
                  <div style={styles.actionWrapper}>
                    <select 
                      value={ratingInputs[store.id]} 
                      onChange={(e) => handleRatingChange(store.id, parseInt(e.target.value))}
                      style={styles.select}
                    >
                      <option value={1}>1 Star</option>
                      <option value={2}>2 Stars</option>
                      <option value={3}>3 Stars</option>
                      <option value={4}>4 Stars</option>
                      <option value={5}>5 Stars</option>
                    </select>
                    <button 
                      onClick={() => submitRating(store.id)}
                      style={styles.button}
                    >
                      {store.user_submitted_rating ? 'Modify Rating' : 'Submit Rating'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserDashboard;