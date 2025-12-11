import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import dashboardService from '../../services/dashboardService';

export default function ComplaintsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [complaintsData, roomsData] = await Promise.all([
        dashboardService.getComplaints(),
        dashboardService.getRooms(),
      ]);
      setComplaints(complaintsData || []);
      setRooms(roomsData || []);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (complaintId, newStatus) => {
    try {
      await api.patch(`/kerusakan/${complaintId}/`, { status: newStatus });
      setComplaints(complaints.map(c => 
        c.laporan_id === complaintId || c.id === complaintId 
          ? { ...c, status: newStatus } 
          : c
      ));
    } catch (err) {
      console.error('Error updating complaint:', err);
      setError('Gagal mengupdate status');
    }
  };

  const handleDeleteComplaint = async (complaintId) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus laporan ini?')) return;
    try {
      await api.delete(`/kerusakan/${complaintId}/`);
      setComplaints(complaints.filter(c => (c.laporan_id || c.id) !== complaintId));
    } catch (err) {
      console.error('Error deleting complaint:', err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
      case 'dilaporkan':
        return 'bg-yellow-100 text-yellow-700';
      case 'in_progress':
      case 'diproses':
        return 'bg-blue-100 text-blue-700';
      case 'resolved':
      case 'selesai':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending':
      case 'dilaporkan':
        return '⏳ Menunggu';
      case 'in_progress':
      case 'diproses':
        return '🔧 Diproses';
      case 'resolved':
      case 'selesai':
        return '✓ Selesai';
      default:
        return status;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'urgent':
        return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">🔴 Urgent</span>;
      case 'high':
        return <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">🟠 Tinggi</span>;
      case 'medium':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">🟡 Sedang</span>;
      case 'low':
        return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">🟢 Rendah</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">-</span>;
    }
  };

  // Filter complaints
  const filteredComplaints = complaints.filter(c => {
    if (filter === 'all') return true;
    if (filter === 'pending') return c.status === 'pending' || c.status === 'dilaporkan';
    if (filter === 'in_progress') return c.status === 'in_progress' || c.status === 'diproses';
    if (filter === 'resolved') return c.status === 'resolved' || c.status === 'selesai';
    return true;
  });

  // Stats
  const pendingCount = complaints.filter(c => c.status === 'pending' || c.status === 'dilaporkan').length;
  const inProgressCount = complaints.filter(c => c.status === 'in_progress' || c.status === 'diproses').length;
  const resolvedCount = complaints.filter(c => c.status === 'resolved' || c.status === 'selesai').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white">
      {/* Header */}
      <header className="w-full" style={{ backgroundColor: '#00A5E8' }}>
        <div className="w-full px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/admin/fitur')}
              className="text-white hover:text-white/80 text-xl"
            >
              ←
            </button>
            <span className="font-semibold tracking-wide text-white">Komplain Penghuni</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right leading-tight">
              <div className="text-sm text-white">{user?.first_name || 'User'}</div>
              <div className="text-xs text-white/80">Pemilik</div>
            </div>
            <img
              src={`https://i.pravatar.cc/40?u=${encodeURIComponent(user?.first_name || 'User')}`}
              alt="avatar"
              className="h-9 w-9 rounded-full ring-2 ring-white/50"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-purple-500">
            <p className="text-gray-500 text-sm font-medium">Total Komplain</p>
            <p className="text-3xl font-bold text-gray-800">{complaints.length}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-yellow-500">
            <p className="text-gray-500 text-sm font-medium">Menunggu</p>
            <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-blue-500">
            <p className="text-gray-500 text-sm font-medium">Diproses</p>
            <p className="text-3xl font-bold text-blue-600">{inProgressCount}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-green-500">
            <p className="text-gray-500 text-sm font-medium">Selesai</p>
            <p className="text-3xl font-bold text-green-600">{resolvedCount}</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { key: 'all', label: 'Semua' },
            { key: 'pending', label: 'Menunggu' },
            { key: 'in_progress', label: 'Diproses' },
            { key: 'resolved', label: 'Selesai' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === tab.key
                  ? 'bg-purple-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Complaints List */}
        <div className="space-y-4">
          {filteredComplaints.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <span className="text-6xl mb-4 block">📝</span>
              <p className="text-gray-500 text-lg">Tidak ada komplain</p>
            </div>
          ) : (
            filteredComplaints.map(complaint => (
              <div key={complaint.laporan_id || complaint.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="font-bold text-gray-800">
                        Kamar {complaint.kamar_detail?.room_number || complaint.kamar_detail?.nomor_kamar || complaint.kamar}
                      </span>
                      {getPriorityBadge(complaint.priority)}
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(complaint.status)}`}>
                        {getStatusLabel(complaint.status)}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-3">{complaint.deskripsi || complaint.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>👤 {complaint.penyewa_username || complaint.user_detail?.username || '-'}</span>
                      <span>📅 {complaint.created_at ? new Date(complaint.created_at).toLocaleDateString('id-ID') : '-'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {(complaint.status === 'pending' || complaint.status === 'dilaporkan') && (
                      <button
                        onClick={() => handleUpdateStatus(complaint.laporan_id || complaint.id, 'in_progress')}
                        className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-200 transition-colors"
                      >
                        Proses
                      </button>
                    )}
                    {(complaint.status === 'in_progress' || complaint.status === 'diproses') && (
                      <button
                        onClick={() => handleUpdateStatus(complaint.laporan_id || complaint.id, 'resolved')}
                        className="px-4 py-2 bg-green-100 text-green-600 rounded-lg text-sm font-semibold hover:bg-green-200 transition-colors"
                      >
                        Selesai
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteComplaint(complaint.laporan_id || complaint.id)}
                      className="px-4 py-2 bg-red-100 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-200 transition-colors"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
