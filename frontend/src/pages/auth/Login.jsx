import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login(username, password);
      
      if (data?.user?.role === 'admin') {
        navigate('/admin');
      } else {
        // backend and other parts of app use 'penyewa' route
        navigate('/penyewa');
      }
    } catch (err) {
      const errorMessage = typeof err === 'string' ? err : 'Login gagal.';
      
      // Check if it's an unregistered user error
      if (errorMessage.toLowerCase().includes('not found') || 
          errorMessage.toLowerCase().includes('tidak ditemukan') ||
          errorMessage.toLowerCase().includes('invalid')) {
        setShowSignupPrompt(true);
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Decorative dots - top right */}
      <div className="dots dots-top-right">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>

      {/* Main form */}
      <div className="login-form">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input-field"
            autoComplete="off"
            required
          />

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
            className="input-field password-input"
            autoComplete="off"
            required
          />

          {/* Show/Hide Password Toggle */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            marginTop: '-8px',
            marginBottom: '12px',
            paddingRight: '4px',
          }}>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#666',
                fontSize: '13px',
                fontWeight: '500',
                padding: '4px 8px',
              }}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          {error && (
            <div className="error-message" style={{ color: 'red', fontSize: '14px' }}>
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="login-button" 
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Login'}
          </button>
        </form>

        <div className="form-links">
          <a>
            Forget Password? Call Admin for Help
          </a>
        </div>
      </div>

      {/* Decorative dots - bottom left */}
      <div className="dots dots-bottom-left">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>

      {/* Signup Prompt Modal */}
      {showSignupPrompt && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '32px',
            borderRadius: '12px',
            maxWidth: '400px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
            textAlign: 'center',
          }}>
            <h2 style={{
              margin: '0 0 16px 0',
              color: '#333',
              fontSize: '20px',
              fontWeight: '600',
            }}>
              Account Not Found
            </h2>
            <p style={{
              margin: '0 0 24px 0',
              color: '#666',
              fontSize: '14px',
              lineHeight: '1.5',
            }}>
              It looks like this username is not registered. Please create a new account to get started.
            </p>
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center',
            }}>
              <button
                onClick={() => setShowSignupPrompt(false)}
                style={{
                  padding: '10px 20px',
                  borderRadius: '6px',
                  border: '1px solid #ddd',
                  backgroundColor: 'white',
                  color: '#666',
                  cursor: 'pointer',
                  fontWeight: '500',
                  fontSize: '14px',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
              >
                Try Again
              </button>
              <button
                onClick={() => {
                  setShowSignupPrompt(false);
                  navigate('/register');
                }}
                style={{
                  padding: '10px 20px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: '#7c3aed',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: '500',
                  fontSize: '14px',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#6d28d9'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#7c3aed'}
              >
                Sign Up Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}