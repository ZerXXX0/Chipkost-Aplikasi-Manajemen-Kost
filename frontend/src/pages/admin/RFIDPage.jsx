import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SubHeader from '../../components/dashboard/SubHeader';
import api from '../../services/api';

export default function RFIDPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [rfidCards, setRfidCards] = useState([]);
  const [accessLogs, setAccessLogs] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('cards'); // 'cards' or 'logs'
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSimulateModal, setShowSimulateModal] = useState(false);
  const [cardForm, setCardForm] = useState({
    card_id: '',
    penyewa: '',
    room: '',
    status: 'active'
  });
  const [simulateForm, setSimulateForm] = useState({
    card_id: '',
    room_id: ''
  });
  const [error, setError] = useState('');
  const [simulateResult, setSimulateResult] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [cardsRes, logsRes, roomsRes, usersRes] = await Promise.all([
        api.get('/rfid/'),
        api.get('/access-logs/'),
        api.get('/kamar/'),
        api.get('/auth/users/')
      ]);
      setRfidCards(Array.isArray(cardsRes.data) ? cardsRes.data : cardsRes.data?.results || []);
      setAccessLogs(Array.isArray(logsRes.data) ? logsRes.data : logsRes.data?.results || []);
      setRooms(Array.isArray(roomsRes.data) ? roomsRes.data : roomsRes.data?.results || []);
      setUsers(Array.isArray(usersRes.data) ? usersRes.data : usersRes.data?.results || []);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCard = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/rfid/', {
        ...cardForm,
        penyewa: cardForm.penyewa ? parseInt(cardForm.penyewa) : null,
        room: parseInt(cardForm.room)
      });
      setRfidCards([response.data, ...rfidCards]);
      setShowCreateModal(false);
      setCardForm({ card_id: '', penyewa: '', room: '', status: 'active' });
      setError('');
    } catch (err) {
      console.error('Error creating RFID card:', err);
      setError(err.response?.data?.card_id?.[0] || err.response?.data?.detail || 'Gagal mendaftarkan kartu RFID');
    }
  };

  const handlePenyewaChange = (e) => {
    const penyewaId = e.target.value;
    setCardForm({ ...cardForm, penyewa: penyewaId });
    
    // Auto-assign kamar dari penyewa yang dipilih
    if (penyewaId) {
      const selectedUser = users.find(u => u.id === parseInt(penyewaId));
      if (selectedUser) {
        // Cari kamar yang ditempati oleh penyewa ini
        const userRoom = rooms.find(r => 
          r.penyewa === parseInt(penyewaId) || 
          r.penyewa_username === selectedUser.username
        );
        if (userRoom) {
          setCardForm(prev => ({ ...prev, room: userRoom.id }));
        } else {
          // Reset kamar jika penyewa tidak punya kamar
          setCardForm(prev => ({ ...prev, room: '' }));
        }
      }
    } else {
      // Reset kamar jika penyewa di-kosongkan
      setCardForm(prev => ({ ...prev, room: '' }));
    }
  };

  const handleUpdateStatus = async (cardId, newStatus) => {
    try {
      await api.patch(`/rfid/${cardId}/`, { status: newStatus });
      setRfidCards(rfidCards.map(card => 
        card.id === cardId ? { ...card, status: newStatus } : card
      ));
    } catch (err) {
      console.error('Error updating card status:', err);
    }
  };

  const handleDeleteCard = async (cardId) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus kartu RFID ini?')) return;
    try {
      await api.delete(`/rfid/${cardId}/`);
      setRfidCards(rfidCards.filter(card => card.id !== cardId));
    } catch (err) {
      console.error('Error deleting card:', err);
    }
  };

  const handleSimulateTap = async (e) => {
    e.preventDefault();
    try {
      setSimulateResult(null);
      const response = await api.post('/rfid/tap/', {
        card_id: simulateForm.card_id,
        room_id: parseInt(simulateForm.room_id)
      });
      setSimulateResult({
        success: true,
        ...response.data
      });
      // Refresh access logs
      const logsRes = await api.get('/access-logs/');
      setAccessLogs(Array.isArray(logsRes.data) ? logsRes.data : logsRes.data?.results || []);
    } catch (err) {
      setSimulateResult({
        success: false,
        status: err.response?.data?.status || 'denied',
        message: err.response?.data?.message || 'Akses ditolak',
        card_id: simulateForm.card_id
      });
      // Refresh access logs even on error (denied access is logged)
      const logsRes = await api.get('/access-logs/');
      setAccessLogs(Array.isArray(logsRes.data) ? logsRes.data : logsRes.data?.results || []);
    }
  };

  const generateRandomCardId = () => {
    const chars = 'ABCDEF0123456789';
    let cardId = '';
    for (let i = 0; i < 8; i++) {
      cardId += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCardForm({ ...cardForm, card_id: cardId });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const penyewaUsers = users.filter(u => u.role === 'penyewa');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data RFID...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white">
      <SubHeader title="Manajemen RFID" backPath="/admin/fitur" />

      {/* Additional Action Buttons */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-4 flex justify-end gap-2">
        <button
          onClick={() => setShowSimulateModal(true)}
          className="px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition-colors"
        >
          Simulasi Tap
        </button>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-cyan-500 text-white font-semibold rounded-lg hover:bg-cyan-600 transition-colors"
        >
          + Daftarkan Kartu
        </button>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
            <p className="text-blue-100 text-sm font-medium mb-2">Total Kartu</p>
            <p className="text-3xl font-bold">{rfidCards.length}</p>
            <p className="text-blue-200 text-sm mt-2">Kartu terdaftar</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
            <p className="text-green-100 text-sm font-medium mb-2">Kartu Aktif</p>
            <p className="text-3xl font-bold">{rfidCards.filter(c => c.status === 'active').length}</p>
            <p className="text-green-200 text-sm mt-2">Dapat digunakan</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl p-6 text-white shadow-lg">
            <p className="text-yellow-100 text-sm font-medium mb-2">Akses Hari Ini</p>
            <p className="text-3xl font-bold">
              {accessLogs.filter(l => {
                const today = new Date().toDateString();
                return new Date(l.access_time).toDateString() === today;
              }).length}
            </p>
            <p className="text-yellow-200 text-sm mt-2">Total akses</p>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white shadow-lg">
            <p className="text-red-100 text-sm font-medium mb-2">Akses Ditolak</p>
            <p className="text-3xl font-bold">
              {accessLogs.filter(l => l.status === 'denied').length}
            </p>
            <p className="text-red-200 text-sm mt-2">Total penolakan</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('cards')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'cards'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Kartu RFID
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'logs'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Log Akses
          </button>
        </div>

        {/* Cards Tab */}
        {activeTab === 'cards' && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">Daftar Kartu RFID</h2>
            </div>
            
            {rfidCards.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-gray-500 text-lg mb-4">Belum ada kartu RFID terdaftar</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Daftarkan Kartu Pertama
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Card ID</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Penyewa</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Kamar</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Terakhir Digunakan</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {rfidCards.map(card => (
                      <tr key={card.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-mono font-semibold text-gray-800 bg-gray-100 px-2 py-1 rounded">
                            {card.card_id}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {card.penyewa_name || card.penyewa_username || '-'}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          Kamar {card.room_number} - {card.kos_name}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                            card.status === 'active'
                              ? 'bg-green-100 text-green-700'
                              : card.status === 'blocked'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {card.status === 'active' ? 'Aktif' : card.status === 'blocked' ? 'Diblokir' : 'Nonaktif'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {formatDate(card.last_used)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {card.status === 'active' ? (
                              <button
                                onClick={() => handleUpdateStatus(card.id, 'blocked')}
                                className="px-3 py-1 bg-red-100 text-red-600 rounded-lg text-sm hover:bg-red-200 transition-colors"
                              >
                                Blokir
                              </button>
                            ) : (
                              <button
                                onClick={() => handleUpdateStatus(card.id, 'active')}
                                className="px-3 py-1 bg-green-100 text-green-600 rounded-lg text-sm hover:bg-green-200 transition-colors"
                              >
                                Aktifkan
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteCard(card.id)}
                              className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                            >
                              Hapus
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Logs Tab */}
        {activeTab === 'logs' && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">Log Akses RFID</h2>
            </div>
            
            {accessLogs.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-gray-500 text-lg">Belum ada log akses</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Waktu</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Card ID</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Penyewa</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Kamar</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Keterangan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {accessLogs.map(log => (
                      <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-gray-600">
                          {formatDate(log.access_time)}
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-mono font-semibold text-gray-800 bg-gray-100 px-2 py-1 rounded">
                            {log.card_id || log.attempted_card_id || '-'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {log.penyewa_name || log.penyewa_username || '-'}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          Kamar {log.room_number}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                            log.status === 'granted'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {log.status === 'granted' ? '✓ Diizinkan' : '✗ Ditolak'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600 text-sm">
                          {log.denied_reason || (log.status === 'granted' ? 'Akses berhasil' : '-')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Create Card Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">Daftarkan Kartu RFID</h2>
            <form onSubmit={handleCreateCard}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Card ID</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={cardForm.card_id}
                    onChange={(e) => setCardForm({ ...cardForm, card_id: e.target.value.toUpperCase() })}
                    className="flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    placeholder="Contoh: A1B2C3D4"
                    maxLength={20}
                    required
                  />
                  <button
                    type="button"
                    onClick={generateRandomCardId}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    Random
                  </button>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Penyewa</label>
                <select
                  value={cardForm.penyewa}
                  onChange={handlePenyewaChange}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Pilih Penyewa --</option>
                  {penyewaUsers.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.first_name} {u.last_name} ({u.username})
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kamar
                  {cardForm.penyewa && cardForm.room && (
                    <span className="text-xs text-green-600 ml-2">Auto-assigned</span>
                  )}
                </label>
                <select
                  value={cardForm.room}
                  onChange={(e) => setCardForm({ ...cardForm, room: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    cardForm.penyewa && cardForm.room ? 'bg-blue-50 border-blue-300' : ''
                  }`}
                  required
                >
                  <option value="">-- Pilih Kamar --</option>
                  {rooms.map(room => (
                    <option key={room.id} value={room.id}>
                      Kamar {room.room_number || room.nomor_kamar} - {room.kos_name || room.kos?.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={cardForm.status}
                  onChange={(e) => setCardForm({ ...cardForm, status: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Aktif</option>
                  <option value="inactive">Nonaktif</option>
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
                  className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold transition-colors"
                >
                  Daftarkan
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setCardForm({ card_id: '', penyewa: '', room: '', status: 'active' });
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

      {/* Simulate Tap Modal */}
      {showSimulateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <h2 className="text-2xl font-bold mb-2">Simulasi Tap Kartu</h2>
            <p className="text-gray-500 text-sm mb-6">Simulasikan penyewa menempelkan kartu RFID pada reader di pintu kamar</p>
            
            <form onSubmit={handleSimulateTap}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Card ID</label>
                <input
                  type="text"
                  value={simulateForm.card_id}
                  onChange={(e) => setSimulateForm({ ...simulateForm, card_id: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  placeholder="Masukkan Card ID"
                  required
                />
                <p className="text-xs text-gray-400 mt-1">Coba masukkan ID yang tidak terdaftar untuk melihat penolakan</p>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Kamar Tujuan</label>
                <select
                  value={simulateForm.room_id}
                  onChange={(e) => setSimulateForm({ ...simulateForm, room_id: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">-- Pilih Kamar --</option>
                  {rooms.map(room => (
                    <option key={room.id} value={room.id}>
                      Kamar {room.room_number || room.nomor_kamar}
                    </option>
                  ))}
                </select>
              </div>

              {/* Result Display */}
              {simulateResult && (
                <div className={`mb-6 p-4 rounded-xl ${
                  simulateResult.status === 'granted' 
                    ? 'bg-green-100 border-2 border-green-300' 
                    : 'bg-red-100 border-2 border-red-300'
                }`}>
                  <div className="flex items-center gap-3">

                    <div className="flex-1">
                      <p className={`font-bold text-lg ${
                        simulateResult.status === 'granted' ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {simulateResult.status === 'granted' ? 'AKSES DIBERIKAN' : 'AKSES DITOLAK'}
                      </p>
                      <p className={`text-sm ${
                        simulateResult.status === 'granted' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {simulateResult.message}
                      </p>
                      {simulateResult.tenant_name && (
                        <p className="text-sm text-gray-700 mt-2 font-medium">
                           {simulateResult.tenant_name}
                        </p>
                      )}
                      {simulateResult.room_display && (
                        <p className="text-sm text-gray-700 mt-1">
                           {simulateResult.room_display}
                        </p>
                      )}
                      {simulateResult.access_time && (
                        <p className="text-xs text-gray-500 mt-2">
                           {new Date(simulateResult.access_time).toLocaleString('id-ID')}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 font-semibold transition-colors"
                >
                  Tap Kartu
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowSimulateModal(false);
                    setSimulateForm({ card_id: '', room_id: '' });
                    setSimulateResult(null);
                  }}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold transition-colors"
                >
                  Tutup
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
