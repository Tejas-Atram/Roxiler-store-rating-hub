import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const styles = {
    nav: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 40px',
      background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.7) 0%, rgba(224, 242, 254, 0.7) 100%)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.9)',
      boxShadow: '0 8px 32px 0 rgba(2, 132, 199, 0.08)',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      position: 'sticky',
      top: 0,
      zIndex: 100
    },
    brand: {
      margin: 0,
      fontSize: '1.4rem',
      fontWeight: '700',
      background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      letterSpacing: '0.5px'
    },
    actions: {
      display: 'flex',
      alignItems: 'center',
      gap: '24px'
    },
    link: {
      textDecoration: 'none',
      color: '#0284c7',
      fontSize: '0.95rem',
      fontWeight: '600',
      letterSpacing: '0.2px',
      padding: '8px 16px',
      background: 'rgba(255, 255, 255, 0.6)',
      borderRadius: '12px',
      border: '1px solid rgba(255, 255, 255, 0.8)',
      boxShadow: '0 4px 12px rgba(2, 132, 199, 0.05)',
      transition: 'all 0.2s ease'
    },
    roleBadge: {
      fontSize: '0.85rem',
      color: '#0369a1',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      padding: '8px 16px',
      borderRadius: '24px',
      fontWeight: '600',
      border: '1px solid rgba(186, 230, 253, 0.8)',
      boxShadow: 'inset 0 2px 4px rgba(255, 255, 255, 1)'
    },
    button: {
      background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
      color: '#ffffff',
      border: 'none',
      padding: '10px 24px',
      borderRadius: '12px',
      fontSize: '0.95rem',
      fontWeight: '500',
      cursor: 'pointer',
      boxShadow: '0 4px 12px rgba(2, 132, 199, 0.2)',
      transition: 'all 0.2s ease',
      letterSpacing: '0.3px'
    }
  };

  return (
    <nav style={styles.nav}>
      <h2 style={styles.brand}>Store Rating Platform</h2>
      <div style={styles.actions}>
        {!user && (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.link}>Register</Link>
          </>
        )}
        {user && (
          <>
            <span style={styles.roleBadge}>Role: {user.role}</span>
            <button onClick={handleLogout} style={styles.button}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;