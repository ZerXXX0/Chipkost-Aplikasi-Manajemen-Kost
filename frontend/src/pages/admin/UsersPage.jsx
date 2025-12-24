import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SubHeader from '../../components/dashboard/SubHeader';
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
  const [rentals, setRentals] = useState([]);
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
    profile_picture: null,
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
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    new_password: '',
    profile_picture: null,
  });
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [editPasswordValidation, setEditPasswordValidation] = useState({
    requirements: {
      minLength: false,
      hasNumber: false,
      hasSpecialChar: false,
    },
    isValid: false,
  });

  useEffect(() => {
    fetchUsers();
    fetchRentals();
  }, []);

  const fetchRentals = async () => {
    try {
      const response = await api.get('/rental/');
      const data = Array.isArray(response.data) ? response.data : response.data.results || [];
      setRentals(data);
    } catch (err) {
      console.error('Error fetching rentals:', err);
    }
  };

  // Get rental end date for a user
  const getRentalEndDate = (userId) => {
    const rental = rentals.find(r => r.penyewa === userId && r.status === 'active');
    return rental?.end_date || null;
  };

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

  const handleEditUser = (user) => {
    setEditingUser(user);
    setEditFormData({
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      email: user.email || '',
      phone_number: user.phone_number || '',
      new_password: '',
      profile_picture: null,
    });
    setShowEditPassword(false);
  };

  const handleEditChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'profile_picture') {
      setEditFormData({
        ...editFormData,
        profile_picture: files && files[0] ? files[0] : null,
      });
      return;
    }

    setEditFormData({
      ...editFormData,
      [name]: value,
    });

    if (name === 'new_password') {
      if (value === '') {
        // Reset validation when password is empty
        setEditPasswordValidation({
          requirements: {
            minLength: false,
            hasNumber: false,
            hasSpecialChar: false,
          },
          isValid: true, // Valid because it's optional
        });
      } else {
        setEditPasswordValidation(validatePassword(value));
      }
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate password if provided
    if (editFormData.new_password && !editPasswordValidation.isValid) {
      setError('Password tidak memenuhi persyaratan');
      return;
    }

    setSubmitting(true);

    try {
      const payload = new FormData();
      Object.entries(editFormData).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          payload.append(key, value);
        }
      });

      const response = await api.put(`/auth/users/${editingUser.id}/update/`, payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setSuccess(response.data.message);
      
      setTimeout(() => {
        fetchUsers();
        setEditingUser(null);
        setSuccess('');
      }, 1500);
    } catch (err) {
      console.error('Error updating user:', err);
      setError(err.response?.data?.error || 'Gagal mengupdate user');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async (userId, username) => {
    const confirmMessage = `Apakah Anda yakin ingin menghapus user "${username}"?\n\nSemua kamar yang di-assign ke user ini akan otomatis dilepas.`;
    
    if (!window.confirm(confirmMessage)) return;

    try {
      const response = await api.delete(`/auth/users/${userId}/delete/`);
      setSuccess(response.data.message + (response.data.unassigned_rooms > 0 ? ` (${response.data.unassigned_rooms} kamar dilepas)` : ''));
      
      // Refresh user list
      fetchUsers();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error deleting user:', err);
      setError(err.response?.data?.error || 'Gagal menghapus user');
      
      // Clear error message after 5 seconds
      setTimeout(() => setError(''), 5000);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

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
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          payload.append(key, value);
        }
      });

      await api.post('/auth/register/', payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
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
        profile_picture: null,
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
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white">
      <SubHeader title="Manajemen Pengguna" backPath="/admin/fitur" />

      {/* Additional Action Button */}
      {!showRegisterForm && (
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4 flex justify-end">
          <button
            onClick={() => setShowRegisterForm(true)}
            className="px-4 py-2 bg-cyan-500 text-white font-semibold rounded-lg hover:bg-cyan-600 transition-colors"
          >
            + Tambah User
          </button>
        </div>
      )}

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

                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <label style={{ fontSize: '12px', color: '#6b7280', marginBottom: '6px', fontWeight: 600 }}>Role</label>
                  <div style={{
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px',
                    color: '#374151',
                    backgroundColor: '#ffffff',
                  }}>
                    Penyewa
                  </div>
                  <input type="hidden" name="role" value="penyewa" />
                </div>
              </div>

              {/* Upload Foto Profil (opsional) */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#333', marginBottom: '6px' }}>
                  Foto Profil (opsional)
                </label>
                <input
                  type="file"
                  name="profile_picture"
                  accept="image/*"
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px',
                  }}
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
                  {showPassword ? 'Hide' : 'Show'}
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
                  {showConfirmPassword ? 'Hide' : 'Show'}
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

            {success && (
              <div style={{
                backgroundColor: '#dcfce7',
                color: '#166534',
                padding: '12px',
                borderRadius: '6px',
                marginBottom: '16px',
              }}>
                {success}
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
                        Sewa Sampai
                      </th>
                      <th style={{ padding: '12px', textAlign: 'center', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                        Aksi
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
                        <td style={{ padding: '12px', fontSize: '14px', color: '#374151' }}>
                          {user.role === 'penyewa' || !user.role ? (
                            getRentalEndDate(user.id) ? (
                              <span style={{
                                display: 'inline-block',
                                padding: '4px 8px',
                                backgroundColor: new Date(getRentalEndDate(user.id)) > new Date() ? '#dcfce7' : '#fee2e2',
                                color: new Date(getRentalEndDate(user.id)) > new Date() ? '#166534' : '#dc2626',
                                borderRadius: '4px',
                                fontSize: '12px',
                                fontWeight: '600',
                              }}>
                                {new Date(getRentalEndDate(user.id)).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </span>
                            ) : (
                              <span style={{ color: '#9ca3af' }}>-</span>
                            )
                          ) : (
                            <span style={{ color: '#9ca3af' }}>-</span>
                          )}
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                            <button
                              onClick={() => handleEditUser(user)}
                              style={{
                                padding: '6px 12px',
                                backgroundColor: '#dbeafe',
                                color: '#1e40af',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s',
                              }}
                              onMouseEnter={(e) => e.target.style.backgroundColor = '#bfdbfe'}
                              onMouseLeave={(e) => e.target.style.backgroundColor = '#dbeafe'}
                            >
                              Edit
                            </button>
                            {user.role !== 'admin' && (
                              <button
                                onClick={() => handleDeleteUser(user.id, user.username)}
                                style={{
                                  padding: '6px 12px',
                                  backgroundColor: '#fee2e2',
                                  color: '#dc2626',
                                  border: 'none',
                                  borderRadius: '6px',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  cursor: 'pointer',
                                  transition: 'background-color 0.2s',
                                }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#fecaca'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = '#fee2e2'}
                              >
                                Hapus
                              </button>
                            )}
                          </div>
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

        {/* Edit User Modal */}
        {editingUser && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '32px',
              maxWidth: '600px',
              width: '90%',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px', color: '#111827' }}>
                Edit User: {editingUser.username}
              </h2>

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

              {success && (
                <div style={{
                  backgroundColor: '#dcfce7',
                  color: '#166534',
                  padding: '12px',
                  borderRadius: '6px',
                  marginBottom: '16px',
                }}>
                  {success}
                </div>
              )}

              <form onSubmit={handleEditSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <input
                    type="text"
                    name="first_name"
                    placeholder="Nama Depan"
                    value={editFormData.first_name}
                    onChange={handleEditChange}
                    style={{
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px',
                    }}
                  />

                  <input
                    type="text"
                    name="last_name"
                    placeholder="Nama Belakang"
                    value={editFormData.last_name}
                    onChange={handleEditChange}
                    style={{
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px',
                    }}
                  />
                </div>

                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={editFormData.email}
                  onChange={handleEditChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px',
                    marginBottom: '16px',
                  }}
                />

                <input
                  type="text"
                  name="phone_number"
                  placeholder="Nomor HP"
                  value={editFormData.phone_number}
                  onChange={handleEditChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px',
                    marginBottom: '16px',
                  }}
                />

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                    Foto Profil
                  </label>
                  <input
                    type="file"
                    name="profile_picture"
                    accept="image/*"
                    onChange={handleEditChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px',
                    }}
                  />
                </div>

                <div style={{
                  backgroundColor: '#fef3c7',
                  border: '1px solid #fbbf24',
                  borderRadius: '6px',
                  padding: '12px',
                  marginBottom: '16px',
                }}>
                  <p style={{ fontSize: '14px', color: '#92400e', fontWeight: '600', marginBottom: '8px' }}>
                    Reset Password
                  </p>
                  <p style={{ fontSize: '12px', color: '#92400e', marginBottom: '8px' }}>
                    Kosongkan jika tidak ingin mengubah password. Admin dapat reset password tanpa memasukkan password lama.
                  </p>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showEditPassword ? "text" : "password"}
                      name="new_password"
                      placeholder="Password Baru (minimal 8 karakter)"
                      value={editFormData.new_password}
                      onChange={handleEditChange}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #ddd',
                        borderRadius: '6px',
                        fontSize: '14px',
                      }}
                      autoComplete="off"
                    />
                    <button
                      type="button"
                      onClick={() => setShowEditPassword(!showEditPassword)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#666',
                        fontSize: '13px',
                      }}
                    >
                      {showEditPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>

                  {editFormData.new_password && (
                    <div style={{
                      backgroundColor: '#ffffff',
                      padding: '12px',
                      borderRadius: '6px',
                      marginTop: '12px',
                      fontSize: '13px',
                      border: '1px solid #e5e7eb',
                    }}>
                      <p style={{ margin: '0 0 8px 0', fontWeight: '600', color: '#333' }}>Password Requirements:</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          color: editPasswordValidation.requirements.minLength ? '#22c55e' : '#ef4444',
                        }}>
                          <span>{editPasswordValidation.requirements.minLength ? '✓' : '✗'}</span>
                          <span>Minimum 8 characters</span>
                        </div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          color: editPasswordValidation.requirements.hasNumber ? '#22c55e' : '#ef4444',
                        }}>
                          <span>{editPasswordValidation.requirements.hasNumber ? '✓' : '✗'}</span>
                          <span>At least 1 number (0-9)</span>
                        </div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          color: editPasswordValidation.requirements.hasSpecialChar ? '#22c55e' : '#ef4444',
                        }}>
                          <span>{editPasswordValidation.requirements.hasSpecialChar ? '✓' : '✗'}</span>
                          <span>At least 1 special character (@, !, #, $, etc.)</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingUser(null);
                      setError('');
                      setSuccess('');
                    }}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#e5e7eb',
                      color: '#374151',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || (editFormData.new_password && !editPasswordValidation.isValid)}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: submitting || (editFormData.new_password && !editPasswordValidation.isValid) ? '#9ca3af' : '#06b6d4',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: submitting || (editFormData.new_password && !editPasswordValidation.isValid) ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {submitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
