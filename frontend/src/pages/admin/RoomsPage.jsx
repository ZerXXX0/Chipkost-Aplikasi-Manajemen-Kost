import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SubHeader from '../../components/dashboard/SubHeader';
import api from '../../services/api';

export default function RoomsPage() {
  const navigate = useNavigate();
  const [kosList, setKosList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddKosModal, setShowAddKosModal] = useState(false);
  const [showEditKosModal, setShowEditKosModal] = useState(false);
  const [editingKos, setEditingKos] = useState(null);
  const [kosForm, setKosForm] = useState({
    name: '',
    address: '',
  });

  useEffect(() => {
    fetchKosList();
  }, []);

  const fetchKosList = async () => {
    try {
      setLoading(true);
      const response = await api.get('/kos/');
      const data = Array.isArray(response.data) ? response.data : response.data.results || [];
      setKosList(data);
      setError('');
    } catch (err) {
      console.error('Error fetching kos:', err);
      console.error('Error details:', err.response?.data || err.message);
      setError(`Gagal memuat daftar kos: ${err.response?.data?.detail || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddKos = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/kos/', kosForm);
      const newKos = response.data;
      const currentList = Array.isArray(kosList) ? kosList : [];
      setKosList([...currentList, newKos]);
      setShowAddKosModal(false);
      setKosForm({ name: '', address: '' });
      setError('');
    } catch (err) {
      console.error('Error adding kos:', err);
      setError(err.response?.data?.detail || err.response?.data?.name?.[0] || 'Gagal menambahkan kos');
    }
  };

  const handleEditKos = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/kos/${editingKos.id}/`, kosForm);
      setKosList(kosList.map(kos => kos.id === editingKos.id ? response.data : kos));
      setShowEditKosModal(false);
      setEditingKos(null);
      setKosForm({ name: '', address: '' });
      setError('');
    } catch (err) {
      console.error('Error editing kos:', err);
      setError('Gagal mengupdate kos');
    }
  };

  const handleDeleteKos = async (kosId) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus kos ini? Semua kamar akan ikut terhapus.')) return;
    
    try {
      await api.delete(`/kos/${kosId}/`);
      setKosList(kosList.filter(kos => kos.id !== kosId));
      setError('');
    } catch (err) {
      console.error('Error deleting kos:', err);
      setError('Gagal menghapus kos');
    }
  };

  const openEditModal = (kos) => {
    setEditingKos(kos);
    setKosForm({
      name: kos.name,
      address: kos.address,
    });
    setShowEditKosModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white flex items-center justify-center">
        <p className="text-gray-600">Memuat data...</p>
      </div>
    );
  }

  // Error state - show error message
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white">
        <SubHeader title="Kelola Kos" />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-red-50 rounded-lg p-8 border border-red-200">
            <h2 className="text-xl font-bold text-red-800 mb-4">Terjadi Kesalahan</h2>
            <p className="text-red-700 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Coba Lagi
            </button>
          </div>
        </main>
      </div>
    );
  }

  // No Kos registered - show prompt
  if (kosList.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white">
        <SubHeader title="Kelola Kos" />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Belum Ada Kos Terdaftar</h1>
            <p className="text-gray-600 text-lg mb-8">
              Anda harus mendaftarkan Kos terlebih dahulu sebelum menambah kamar
            </p>
            
            <button
              onClick={() => setShowAddKosModal(true)}
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              style={{ backgroundColor: '#00A5E8' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#0088c7'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#00A5E8'}
            >
              Daftarkan Kos Sekarang
            </button>
          </div>
        </main>

        {/* Add Kos Modal */}
        {showAddKosModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold mb-6">Daftarkan Kos Baru</h2>
              <form onSubmit={handleAddKos}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nama Kos</label>
                  <input
                    type="text"
                    value={kosForm.name}
                    onChange={(e) => setKosForm({ ...kosForm, name: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Alamat</label>
                  <textarea
                    value={kosForm.address}
                    onChange={(e) => setKosForm({ ...kosForm, address: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    required
                  />
                </div>
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800 font-medium mb-1">Kamera CCTV</p>
                  <p className="text-xs text-blue-600">
                    Setelah kos dibuat, Anda dapat menambahkan kamera CCTV melalui menu "CCTV" di halaman Fitur.
                    Setiap kos dapat memiliki beberapa kamera dengan URL stream terpisah.
                  </p>
                </div>
                {error && (
                  <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                    {error}
                  </div>
                )}
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    style={{ backgroundColor: '#00A5E8' }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#0088c7'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#00A5E8'}
                  >
                    Simpan
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddKosModal(false);
                      setKosForm({ name: '', address: '' });
                      setError('');
                    }}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Kos exists - show Kos cards
  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white">
      <SubHeader 
        title="Kelola Kos" 
        action={
          <button
            onClick={() => setShowAddKosModal(true)}
            className="absolute right-6 top-24 px-4 py-2 bg-white text-blue-600 font-semibold rounded-lg border border-blue-600 hover:bg-gray-100 transition-colors shadow-md"
          >
            + Tambah Kos
          </button>
        }
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Daftar Kos</h1>
          <p className="text-gray-600">Klik pada kartu kos untuk melihat dan mengelola kamar</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Kos Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {kosList.map(kos => (
            <div 
              key={kos.id} 
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group"
            >
              {/* Card Header - Clickable */}
              <div 
                onClick={() => navigate(`/admin/fitur/rooms/${kos.id}`)}
                className="h-40 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center relative"
                style={{ background: 'linear-gradient(to bottom right, #00A5E8, #0088c7)' }}
              >
                <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                  <p className="text-white text-sm font-semibold">{kos.room_count || 0} Kamar</p>
                </div>
              </div>

              {/* Card Body - Clickable */}
              <div 
                onClick={() => navigate(`/admin/fitur/rooms/${kos.id}`)}
                className="p-6"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {kos.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  <span className="inline-flex items-center">
                    {kos.address}
                  </span>
                </p>
              </div>

              {/* Card Actions */}
              <div className="px-6 pb-6 flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/admin/fitur/rooms/${kos.id}`);
                  }}
                  className="flex-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm font-semibold transition-colors"
                >
                  Lihat Detail
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openEditModal(kos);
                  }}
                  className="px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 text-sm font-semibold transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteKos(kos.id);
                  }}
                  className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-sm font-semibold transition-colors"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Add Kos Modal */}
      {showAddKosModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-6">Tambah Kos Baru</h2>
            <form onSubmit={handleAddKos}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Nama Kos</label>
                <input
                  type="text"
                  value={kosForm.name}
                  onChange={(e) => setKosForm({ ...kosForm, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: Kos Melati"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Alamat</label>
                <textarea
                  value={kosForm.address}
                  onChange={(e) => setKosForm({ ...kosForm, address: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Alamat lengkap kos"
                  required
                />
              </div>
              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  style={{ backgroundColor: '#00A5E8' }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#0088c7'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#00A5E8'}
                >
                  Simpan
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddKosModal(false);
                    setKosForm({ name: '', address: '' });
                    setError('');
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Kos Modal */}
      {showEditKosModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-6">Edit Kos</h2>
            <form onSubmit={handleEditKos}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Nama Kos</label>
                <input
                  type="text"
                  value={kosForm.name}
                  onChange={(e) => setKosForm({ ...kosForm, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Alamat</label>
                <textarea
                  value={kosForm.address}
                  onChange={(e) => setKosForm({ ...kosForm, address: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  required
                />
              </div>
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800 font-medium mb-1">Kamera CCTV</p>
                <p className="text-xs text-blue-600">
                  Setelah kos dibuat, Anda dapat menambahkan kamera CCTV melalui menu "CCTV" di halaman Fitur.
                  Setiap kos dapat memiliki beberapa kamera dengan URL stream terpisah.
                </p>
              </div>
              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  style={{ backgroundColor: '#00A5E8' }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#0088c7'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#00A5E8'}
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditKosModal(false);
                    setEditingKos(null);
                    setKosForm({ name: '', address: '' });
                    setError('');
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
