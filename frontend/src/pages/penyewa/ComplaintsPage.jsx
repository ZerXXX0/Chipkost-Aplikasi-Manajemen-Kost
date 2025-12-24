import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SubHeader from '../../components/dashboard/SubHeader';
import api from '../../services/api';
import dashboardService from '../../services/dashboardService';

export default function PenyewaComplaintsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [myRoom, setMyRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [complaintForm, setComplaintForm] = useState({
    deskripsi: '',
    priority: 'medium',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [complaintsData, roomData] = await Promise.all([
        dashboardService.getComplaints(),
        dashboardService.getMyRoom(),
      ]);
      setComplaints(complaintsData || []);
      setMyRoom(roomData);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateComplaint = async (e) => {
    e.preventDefault();
    if (!myRoom) {
      setError('Anda belum memiliki kamar. Hubungi admin untuk assign kamar.');
      return;
    }
    try {
      const response = await api.post('/kerusakan/', {
        kamar: myRoom.id,
        deskripsi: complaintForm.deskripsi,
        priority: complaintForm.priority,
      });
      setComplaints([response.data, ...complaints]);
      setShowCreateModal(false);
      setComplaintForm({ deskripsi: '', priority: 'medium' });
      setError('');
    } catch (err) {
      console.error('Error creating complaint:', err);
      setError(err.response?.data?.detail || err.response?.data?.kamar?.[0] || 'Gagal membuat komplain');
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
        return 'Menunggu';
      case 'in_progress':
      case 'diproses':
        return 'Diproses';
      case 'resolved':
      case 'selesai':
        return 'Selesai';
      default:
        return status;
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'Urgent';
      case 'high':
        return 'Tinggi';
      case 'medium':
        return 'Sedang';
      case 'low':
        return 'Rendah';
      default:
        return priority;
    }
  };

  // Stats
  const pendingCount = complaints.filter(c => c.status === 'pending' || c.status === 'dilaporkan').length;
  const inProgressCount = complaints.filter(c => c.status === 'in_progress' || c.status === 'diproses').length;
  const resolvedCount = complaints.filter(c => c.status === 'resolved' || c.status === 'selesai').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white">
      <SubHeader title="Komplain Saya" backPath="/penyewa/fitur" />
      
      {/* Additional Action Button */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-4 flex justify-end">
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-cyan-500 text-white font-semibold rounded-lg hover:bg-cyan-600 transition-colors"
        >
          + Ajukan Komplain
        </button>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Room Info */}
        {myRoom && (
          <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg mb-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cyan-100 text-sm">Kamar Anda</p>
                <p className="text-4xl font-bold">{myRoom.room_number || myRoom.nomor_kamar}</p>
                <p className="text-cyan-200 text-sm mt-1">{myRoom.kos_name}</p>
              </div>
              <div className="text-right">
                <p className="text-cyan-100 text-sm">Total Komplain</p>
                <p className="text-4xl font-bold">{complaints.length}</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-4 shadow-lg text-center">
            <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
            <p className="text-gray-500 text-sm">Menunggu</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-lg text-center">
            <p className="text-3xl font-bold text-blue-600">{inProgressCount}</p>
            <p className="text-gray-500 text-sm">Diproses</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-lg text-center">
            <p className="text-3xl font-bold text-green-600">{resolvedCount}</p>
            <p className="text-gray-500 text-sm">Selesai</p>
          </div>
        </div>

        {/* Complaints List */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Riwayat Komplain</h2>
          {complaints.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <p className="text-gray-500 text-lg mb-4">Belum ada komplain</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
              >
                Ajukan Komplain Pertama
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {complaints.map(complaint => (
                <div key={complaint.laporan_id || complaint.id} className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-start justify-between mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(complaint.status)}`}>
                      {getStatusLabel(complaint.status)}
                    </span>
                    <span className="text-gray-500 text-sm">
                      {complaint.created_at ? new Date(complaint.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      }) : '-'}
                    </span>
                  </div>
                  <p className="text-gray-800 mb-3">{complaint.deskripsi || complaint.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Prioritas: {getPriorityLabel(complaint.priority)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Create Complaint Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <h2 className="text-2xl font-bold mb-2">Ajukan Komplain</h2>
            <p className="text-gray-500 mb-6">
              {myRoom 
                ? `Kamar ${myRoom.room_number || myRoom.nomor_kamar} - ${myRoom.kos_name}`
                : 'Anda belum memiliki kamar'}
            </p>
            
            <form onSubmit={handleCreateComplaint}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi Masalah</label>
                <textarea
                  value={complaintForm.deskripsi}
                  onChange={(e) => setComplaintForm({ ...complaintForm, deskripsi: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                  rows={4}
                  placeholder="Jelaskan masalah yang Anda alami..."
                  required
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Tingkat Prioritas</label>
                <select
                  value={complaintForm.priority}
                  onChange={(e) => setComplaintForm({ ...complaintForm, priority: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="low">Rendah - Tidak mendesak</option>
                  <option value="medium">Sedang - Perlu ditangani</option>
                  <option value="high">Tinggi - Segera ditangani</option>
                  <option value="urgent">Urgent - Darurat!</option>
                </select>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={!myRoom}
                  className="flex-1 px-4 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Kirim Komplain
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setComplaintForm({ deskripsi: '', priority: 'medium' });
                    setError('');
                  }}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold transition-colors"
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
