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

  return (
    <div>
      <h2>User Dashboard</h2>
      
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <input 
          name="name" 
          placeholder="Search by Store Name" 
          value={filters.name} 
          onChange={handleFilterChange} 
          style={{ padding: '8px' }}
        />
        <input 
          name="address" 
          placeholder="Search by Address" 
          value={filters.address} 
          onChange={handleFilterChange} 
          style={{ padding: '8px' }}
        />
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f5f5f5', textAlign: 'left' }}>
            <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Store Name</th>
            <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Address</th>
            <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Overall Rating</th>
            <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Your Rating</th>
            <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {stores.map(store => (
            <tr key={store.id}>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{store.name}</td>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{store.address}</td>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                {Number(store.average_rating).toFixed(1)} / 5
              </td>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                {store.user_submitted_rating ? `${store.user_submitted_rating} / 5` : 'Not rated yet'}
              </td>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd', display: 'flex', gap: '10px' }}>
                <select 
                  value={ratingInputs[store.id]} 
                  onChange={(e) => handleRatingChange(store.id, parseInt(e.target.value))}
                  style={{ padding: '5px' }}
                >
                  <option value={1}>1 Star</option>
                  <option value={2}>2 Stars</option>
                  <option value={3}>3 Stars</option>
                  <option value={4}>4 Stars</option>
                  <option value={5}>5 Stars</option>
                </select>
                <button 
                  onClick={() => submitRating(store.id)}
                  style={{ padding: '5px 10px' }}
                >
                  {store.user_submitted_rating ? 'Modify Rating' : 'Submit Rating'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserDashboard;