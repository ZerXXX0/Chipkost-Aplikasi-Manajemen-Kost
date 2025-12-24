import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Login.css'; // Reusing the same CSS

// Password validation helper
const validatePassword = (password) => {
  const requirements = {
    minLength: password.length >= 8,
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[@!#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };

  const isValid = Object.values(requirements).every(req => req);

  return { requirements, isValid };
};

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    role: 'penyewa',
    profile_picture: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    requirements: {
      minLength: false,
      hasNumber: false,
      hasSpecialChar: false,
    },
    isValid: false,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    // Handle file input separately
    if (name === 'profile_picture') {
      setFormData({
        ...formData,
        profile_picture: files && files[0] ? files[0] : null,
      });
      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });

    // Real-time validation for password field
    if (name === 'password') {
      setPasswordValidation(validatePassword(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!passwordValidation.isValid) {
      setError('Password does not meet requirements.');
      return;
    }

    if (formData.password !== formData.password2) {
      setError('Password tidak sama.');
      return;
    }

    setLoading(true);

    try {
      const data = await register(formData);

      // After successful registration we send the user back to the login page
      // so they can authenticate explicitly.
      navigate('/login');
    } catch (err) {
      const errorMessages = [];
      
      // Handle different error formats
      if (typeof err === 'object' && err !== null) {
        // Handle field-specific errors
        Object.keys(err).forEach(key => {
          if (Array.isArray(err[key])) {
            errorMessages.push(`${key}: ${err[key].join(', ')}`);
          } else if (typeof err[key] === 'string') {
            errorMessages.push(`${key}: ${err[key]}`);
          }
        });
      }
      
      setError(errorMessages.length > 0 ? errorMessages.join(' | ') : 'Registration failed. Please try again.');
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
      <div className="login-form" style={{ maxWidth: '500px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '24px', color: '#333' }}>
            Create Account
          </h2>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="input-field"
              autoComplete="off"
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="input-field"
              required
            />

            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              value={formData.first_name}
              onChange={handleChange}
              className="input-field"
              required
            />

            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              value={formData.last_name}
              onChange={handleChange}
              className="input-field"
              required
            />

            <input
              type="tel"
              name="phone_number"
              placeholder="Phone Number"
              value={formData.phone_number}
              onChange={handleChange}
              className="input-field"
            />

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="input-field"
            >
              <option value="penyewa">Penyewa</option>
            </select>
          </div>

          {/* Upload Foto Profil (opsional) */}
          <div style={{ marginTop: '12px', marginBottom: '12px' }}>
            <label style={{ fontSize: '14px', fontWeight: 600, color: '#333' }}>Foto Profil (opsional)</label>
            <input
              type="file"
              name="profile_picture"
              accept="image/*"
              onChange={handleChange}
              className="input-field"
              style={{ padding: '10px' }}
            />
            {formData.profile_picture && (
              <p style={{ fontSize: '12px', color: '#555', marginTop: '6px' }}>
                File dipilih: {formData.profile_picture.name}
              </p>
            )}
          </div>

          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="input-field"
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

          {/* Password validation requirements */}
          {formData.password && (
            <div style={{
              backgroundColor: '#f5f5f5',
              padding: '12px',
              borderRadius: '6px',
              marginBottom: '12px',
              fontSize: '13px',
            }}>
              <p style={{ margin: '0 0 8px 0', fontWeight: '600', color: '#333' }}>Password Requirements:</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: passwordValidation.requirements.minLength ? '#22c55e' : '#ef4444',
                }}>
                  <span>{passwordValidation.requirements.minLength ? '✓' : '✗'}</span>
                  <span>Minimum 8 characters</span>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: passwordValidation.requirements.hasNumber ? '#22c55e' : '#ef4444',
                }}>
                  <span>{passwordValidation.requirements.hasNumber ? '✓' : '✗'}</span>
                  <span>At least 1 number (0-9)</span>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: passwordValidation.requirements.hasSpecialChar ? '#22c55e' : '#ef4444',
                }}>
                  <span>{passwordValidation.requirements.hasSpecialChar ? '✓' : '✗'}</span>
                  <span>At least 1 special character (@, !, #, $, etc.)</span>
                </div>
              </div>
            </div>
          )}

          <input
            type={showConfirmPassword ? "text" : "password"}
            name="password2"
            placeholder="Confirm Password"
            value={formData.password2}
            onChange={handleChange}
            className="input-field"
            autoComplete="off"
            required
          />

          {/* Show/Hide Confirm Password Toggle */}
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
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
              {showConfirmPassword ? 'Hide' : 'Show'}
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
            disabled={loading || !passwordValidation.isValid}
            style={{
              opacity: !passwordValidation.isValid ? 0.6 : 1,
              cursor: !passwordValidation.isValid ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="form-links">
          <p className="signup-text">
            Already have an account? <a href="/login" className="signup-link">Login</a>
          </p>
        </div>
      </div>

      {/* Decorative dots - bottom left */}
      <div className="dots dots-bottom-left">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
    </div>
  );
}
