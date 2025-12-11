import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

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

export default function UsersPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    role: 'penyewa',
  });
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
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/auth/users/');
      // Handle both paginated and non-paginated responses
      const data = Array.isArray(response.data) ? response.data : response.data.results || [];
      setUsers(data);
      setError('');
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Gagal memuat daftar pengguna');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === 'password') {
      setPasswordValidation(validatePassword(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!passwordValidation.isValid) {
      setError('Password tidak memenuhi persyaratan.');
      return;
    }

    if (formData.password !== formData.password2) {
      setError('Password tidak sama.');
      return;
    }

    setSubmitting(true);

    try {
      await api.post('/auth/register/', formData);
      setSuccess('User berhasil didaftarkan!');
      
      setFormData({
        username: '',
        email: '',
        password: '',
        password2: '',
        first_name: '',
        last_name: '',
        phone_number: '',
        role: 'penyewa',
      });

      setTimeout(() => {
        fetchUsers();
        setShowRegisterForm(false);
      }, 1500);
    } catch (err) {
      const errorMessages = [];
      
      if (typeof err.response?.data === 'object' && err.response.data !== null) {
        Object.keys(err.response.data).forEach(key => {
          if (Array.isArray(err.response.data[key])) {
            errorMessages.push(`${key}: ${err.response.data[key].join(', ')}`);
          } else if (typeof err.response.data[key] === 'string') {
            errorMessages.push(`${key}: ${err.response.data[key]}`);
          }
        });
      }
      
      setError(errorMessages.length > 0 ? errorMessages.join(' | ') : 'Registrasi gagal. Silakan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="w-full bg-blue-600">
        <div className="w-full px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/admin/fitur')}
              className="text-white hover:text-white/80 text-xl"
              style={{ transition: 'opacity 0.2s' }}
            >
              ←
            </button>
            <span className="font-semibold tracking-wide text-white">Manajemen Pengguna</span>
          </div>
          {!showRegisterForm && (
            <button
              onClick={() => setShowRegisterForm(true)}
              style={{
                padding: '8px 16px',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#059669'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#10b981'}
            >
              + Tambah User
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {showRegisterForm ? (
          // Registration Form
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Daftarkan User Baru</h1>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  style={{
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px',
                  }}
                  required
                />

                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  style={{
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px',
                  }}
                  required
                />

                <input
                  type="text"
                  name="first_name"
                  placeholder="Nama Depan"
                  value={formData.first_name}
                  onChange={handleChange}
                  style={{
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px',
                  }}
                  required
                />

                <input
                  type="text"
                  name="last_name"
                  placeholder="Nama Belakang"
                  value={formData.last_name}
                  onChange={handleChange}
                  style={{
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px',
                  }}
                  required
                />

                <input
                  type="tel"
                  name="phone_number"
                  placeholder="Nomor HP"
                  value={formData.phone_number}
                  onChange={handleChange}
                  style={{
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px',
                  }}
                />

                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  style={{
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px',
                  }}
                >
                  <option value="penyewa">Penyewa</option>
                </select>
              </div>

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '14px',
                  marginBottom: '8px',
                  boxSizing: 'border-box',
                }}
                autoComplete="off"
                required
              />

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
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
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#333'}
                  onMouseLeave={(e) => e.target.style.color = '#666'}
                >
                  {showPassword ? '👁 Hide' : '👁‍🗨 Show'}
                </button>
              </div>

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
                placeholder="Konfirmasi Password"
                value={formData.password2}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '14px',
                  marginBottom: '8px',
                  boxSizing: 'border-box',
                }}
                autoComplete="off"
                required
              />

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                marginBottom: '16px',
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
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#333'}
                  onMouseLeave={(e) => e.target.style.color = '#666'}
                >
                  {showConfirmPassword ? '👁 Hide' : '👁‍🗨 Show'}
                </button>
              </div>

              {error && (
                <div style={{
                  backgroundColor: '#fee2e2',
                  color: '#dc2626',
                  padding: '12px',
                  borderRadius: '6px',
                  marginBottom: '16px',
                  fontSize: '14px',
                }}>
                  {error}
                </div>
              )}

              {success && (
                <div style={{
                  backgroundColor: '#dcfce7',
                  color: '#16a34a',
                  padding: '12px',
                  borderRadius: '6px',
                  marginBottom: '16px',
                  fontSize: '14px',
                }}>
                  {success}
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="submit"
                  disabled={submitting || !passwordValidation.isValid}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: passwordValidation.isValid ? '#2563eb' : '#b3d9ff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: passwordValidation.isValid ? 'pointer' : 'not-allowed',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    if (passwordValidation.isValid) e.target.style.backgroundColor = '#1d4ed8';
                  }}
                  onMouseLeave={(e) => {
                    if (passwordValidation.isValid) e.target.style.backgroundColor = '#2563eb';
                  }}
                >
                  {submitting ? 'Mendaftarkan...' : 'Daftarkan User'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowRegisterForm(false);
                    setError('');
                    setSuccess('');
                  }}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#e5e7eb',
                    color: '#374151',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#d1d5db'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#e5e7eb'}
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        ) : (
          // Users List
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Daftar Pengguna</h1>

            {error && (
              <div style={{
                backgroundColor: '#fee2e2',
                color: '#dc2626',
                padding: '12px',
                borderRadius: '6px',
                marginBottom: '16px',
              }}>
                {error}
              </div>
            )}

            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Memuat data pengguna...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-6">Belum ada pengguna terdaftar</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f3f4f6', borderBottom: '2px solid #e5e7eb' }}>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                        Username
                      </th>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                        Email
                      </th>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                        Nama Lengkap
                      </th>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                        Nomor HP
                      </th>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                        Role
                      </th>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                        Terdaftar
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr
                        key={user.id}
                        style={{
                          borderBottom: '1px solid #e5e7eb',
                          backgroundColor: user.id % 2 === 0 ? '#ffffff' : '#f9fafb',
                        }}
                      >
                        <td style={{ padding: '12px', fontSize: '14px', color: '#374151' }}>
                          {user.username}
                        </td>
                        <td style={{ padding: '12px', fontSize: '14px', color: '#374151' }}>
                          {user.email}
                        </td>
                        <td style={{ padding: '12px', fontSize: '14px', color: '#374151' }}>
                          {user.first_name && user.last_name
                            ? `${user.first_name} ${user.last_name}`
                            : user.first_name || '-'}
                        </td>
                        <td style={{ padding: '12px', fontSize: '14px', color: '#374151' }}>
                          {user.phone_number || '-'}
                        </td>
                        <td style={{ padding: '12px', fontSize: '14px', color: '#374151' }}>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '4px 8px',
                              backgroundColor: user.role === 'admin' ? '#fee2e2' : '#dbeafe',
                              color: user.role === 'admin' ? '#dc2626' : '#1e40af',
                              borderRadius: '4px',
                              fontSize: '12px',
                              fontWeight: '600',
                            }}
                          >
                            {user.role || 'penyewa'}
                          </span>
                        </td>
                        <td style={{ padding: '12px', fontSize: '14px', color: '#9ca3af' }}>
                          {new Date(user.date_joined).toLocaleDateString('id-ID')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div style={{ marginTop: '20px' }}>
              <button
                onClick={() => navigate('/admin/fitur')}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#e5e7eb',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#d1d5db'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#e5e7eb'}
              >
                Kembali
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
