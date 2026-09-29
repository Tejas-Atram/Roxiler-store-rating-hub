import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const user = await login(email, password);
      if (user.role === 'ADMIN') {
        navigate('/admin');
      } else if (user.role === 'STORE_OWNER') {
        navigate('/owner');
      } else {
        navigate('/user');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
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
      padding: '20px'
    },
    container: {
      width: '100%',
      maxWidth: '400px',
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
    error: {
      color: '#ef4444',
      backgroundColor: 'rgba(254, 226, 226, 0.6)',
      padding: '12px',
      borderRadius: '8px',
      fontSize: '0.9rem',
      marginBottom: '20px',
      textAlign: 'center',
      border: '1px solid rgba(252, 165, 165, 0.5)'
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
        <h2 style={styles.heading}>Login</h2>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              style={styles.input}
            />
          </div>
          <button type="submit" style={styles.button}>Login</button>
        </form>
        <p style={styles.footerText}>
          Don't have an account? <Link to="/register" style={styles.link}>Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;