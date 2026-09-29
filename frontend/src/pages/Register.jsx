import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState([]);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors([]);
    
    try {
      await api.post('/auth/register', formData);
      navigate('/login');
    } catch (err) {
      if (err.response?.data?.errors) {
        setFieldErrors(err.response.data.errors);
      } else {
        setError(err.response?.data?.message || 'Registration failed');
      }
    }
  };

  const styles = {
    wrapper: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 'calc(100vh - 80px)',
      background: 'linear-gradient(135deg, #f0f8ff 0%, #e0f2fe 100%)',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '20px',
      boxSizing: 'border-box'
    },
    container: {
      width: '100%',
      maxWidth: '450px',
      background: 'rgba(255, 255, 255, 0.55)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderRadius: '20px',
      border: '1px solid rgba(255, 255, 255, 0.8)',
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.04)',
      padding: '40px',
      boxSizing: 'border-box'
    },
    heading: {
      margin: '0 0 24px 0',
      fontSize: '1.8rem',
      fontWeight: '600',
      color: '#0f172a',
      textAlign: 'center',
      letterSpacing: '0.5px'
    },
    formGroup: {
      marginBottom: '20px'
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontSize: '0.9rem',
      fontWeight: '500',
      color: '#0369a1'
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
    textarea: {
      width: '100%',
      padding: '12px 16px',
      borderRadius: '12px',
      border: '1px solid rgba(186, 230, 253, 0.8)',
      background: 'rgba(255, 255, 255, 0.8)',
      color: '#0f172a',
      fontSize: '0.95rem',
      outline: 'none',
      boxSizing: 'border-box',
      minHeight: '100px',
      resize: 'vertical'
    },
    button: {
      width: '100%',
      padding: '14px',
      borderRadius: '12px',
      border: 'none',
      background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
      color: '#ffffff',
      fontSize: '1rem',
      fontWeight: '500',
      cursor: 'pointer',
      boxShadow: '0 4px 12px rgba(2, 132, 199, 0.2)',
      marginTop: '10px'
    },
    errorBox: {
      backgroundColor: 'rgba(254, 226, 226, 0.6)',
      padding: '12px',
      borderRadius: '8px',
      marginBottom: '20px',
      border: '1px solid rgba(252, 165, 165, 0.5)'
    },
    errorText: {
      color: '#ef4444',
      fontSize: '0.9rem',
      margin: 0,
      textAlign: 'center'
    },
    errorList: {
      color: '#ef4444',
      fontSize: '0.9rem',
      margin: '8px 0 0 0',
      paddingLeft: '20px'
    },
    footerText: {
      marginTop: '24px',
      textAlign: 'center',
      fontSize: '0.9rem',
      color: '#0284c7'
    },
    link: {
      color: '#0369a1',
      textDecoration: 'none',
      fontWeight: '600',
      marginLeft: '4px'
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <h2 style={styles.heading}>User Registration</h2>
        
        {(error || fieldErrors.length > 0) && (
          <div style={styles.errorBox}>
            {error && <p style={styles.errorText}>{error}</p>}
            {fieldErrors.length > 0 && (
              <ul style={styles.errorList}>
                {fieldErrors.map((err, index) => (
                  <li key={index}>{err.msg}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Name (20-60 characters)</label>
            <input 
              type="text" 
              name="name"
              value={formData.name} 
              onChange={handleChange} 
              required 
              minLength={20}
              maxLength={60}
              style={styles.input}
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input 
              type="email" 
              name="email"
              value={formData.email} 
              onChange={handleChange} 
              required 
              style={styles.input}
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input 
              type="password" 
              name="password"
              value={formData.password} 
              onChange={handleChange} 
              required 
              minLength={8}
              maxLength={16}
              style={styles.input}
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Address (Max 400 characters)</label>
            <textarea 
              name="address"
              value={formData.address} 
              onChange={handleChange} 
              required 
              maxLength={400}
              style={styles.textarea}
            />
          </div>
          
          <button type="submit" style={styles.button}>Register</button>
        </form>
        
        <p style={styles.footerText}>
          Already have an account? <Link to="/login" style={styles.link}>Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;