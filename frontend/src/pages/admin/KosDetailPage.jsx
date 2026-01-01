import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SubHeader from '../../components/dashboard/SubHeader';
import api from '../../services/api';
import dashboardService from '../../services/dashboardService';

export default function KosDetailPage() {
  const navigate = useNavigate();
  const { kosId } = useParams();
  const [kos, setKos] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]); // List of penyewa users
  const [complaints, setComplaints] = useState({}); // { roomId: [complaints] }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const [showEditRoomModal, setShowEditRoomModal] = useState(false);
  const [showAssignUserModal, setShowAssignUserModal] = useState(false);
  const [showExtendRentalModal, setShowExtendRentalModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [assigningRoom, setAssigningRoom] = useState(null);
  const [extendingRoom, setExtendingRoom] = useState(null);
  const [rentals, setRentals] = useState({});
  const [roomForm, setRoomForm] = useState({
    nomor_kamar: '',
    harga: '',
    status: 'available',
    description: '',
    capacity: 1,
    floor: 1,
    facilities: '',
    image: null,
  });
  const [selectedUserId, setSelectedUserId] = useState('');
  const [extendForm, setExtendForm] = useState({
    new_end_date: '',
    notes: '',
  });

  useEffect(() => {
    fetchKosDetails();
    fetchRooms();
    fetchUsers();
    fetchRentals();
  }, [kosId]);

  const fetchKosDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/kos/${kosId}/`);
      setKos(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching kos details:', err);
      setError('Gagal memuat detail kos');
    } finally {
      setLoading(false);
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await api.get(`/kamar/?kos=${kosId}`);
      const data = Array.isArray(response.data) ? response.data : response.data.results || [];
      setRooms(data);
      
      // Fetch complaints for each room
      fetchComplaintsForRooms(data);
    } catch (err) {
      console.error('Error fetching rooms:', err);
      setError('Gagal memuat daftar kamar');
    }
  };

  const fetchComplaintsForRooms = async (roomsList) => {
    try {
      const response = await api.get('/kerusakan/');
      const allComplaints = Array.isArray(response.data) ? response.data : response.data.results || [];
      
      // Group complaints by room
      const complaintsByRoom = {};
      roomsList.forEach(room => {
        complaintsByRoom[room.id] = allComplaints.filter(complaint => complaint.kamar === room.id);
      });
      
      setComplaints(complaintsByRoom);
    } catch (err) {
      console.error('Error fetching complaints:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const usersList = await dashboardService.getUsers();
      // Filter only penyewa users
      const penyewaUsers = usersList.filter(u => u.role === 'penyewa');
      setUsers(penyewaUsers);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const fetchRentals = async () => {
    try {
      const response = await api.get('/rental/');
      const data = Array.isArray(response.data) ? response.data : response.data.results || [];
      // Group rentals by room_id
      const rentalsByRoom = {};
      data.forEach(rental => {
        if (rental.status === 'active') {
          rentalsByRoom[rental.room] = rental;
        }
      });
      setRentals(rentalsByRoom);
    } catch (err) {
      console.error('Error fetching rentals:', err);
    }
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('nomor_kamar', roomForm.nomor_kamar);
      formData.append('harga', roomForm.harga);
      formData.append('status', roomForm.status);
      formData.append('description', roomForm.description || '');
      formData.append('capacity', roomForm.capacity || 1);
      formData.append('floor', roomForm.floor || 1);
      formData.append('facilities', roomForm.facilities || '');
      if (roomForm.image) {
        formData.append('image', roomForm.image);
      }
      formData.append('kos', parseInt(kosId, 10));

      const response = await api.post('/kamar/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      const currentRooms = Array.isArray(rooms) ? rooms : [];
      const newRooms = [...currentRooms, response.data];
      setRooms(newRooms);
      setShowAddRoomModal(false);
      setRoomForm({ nomor_kamar: '', harga: '', status: 'available', description: '', capacity: 1, floor: 1, facilities: '', image: null });
      setError('');
      // Refresh kos details and complaints
      fetchKosDetails();
      fetchComplaintsForRooms(newRooms);
    } catch (err) {
      console.error('Error adding room:', err);
      console.error('Error response:', err.response);
      
      // Check if 401 Unauthorized
      if (err.response?.status === 401) {
        setError('Sesi Anda telah berakhir. Silakan login kembali.');
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else {
        setError(err.response?.data?.nomor_kamar?.[0] || err.response?.data?.detail || 'Gagal menambahkan kamar');
      }
    }
  };

  const handleEditRoom = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('nomor_kamar', roomForm.nomor_kamar);
      formData.append('harga', roomForm.harga);
      formData.append('status', roomForm.status);
      formData.append('description', roomForm.description || '');
      formData.append('capacity', roomForm.capacity || 1);
      formData.append('floor', roomForm.floor || 1);
      formData.append('facilities', roomForm.facilities || '');
      formData.append('kos', parseInt(kosId, 10));
      if (roomForm.image && typeof roomForm.image !== 'string') {
        formData.append('image', roomForm.image);
      }

      const response = await api.put(`/kamar/${editingRoom.id}/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const updatedRooms = rooms.map(room => room.id === editingRoom.id ? response.data : room);
      setRooms(updatedRooms);
      setShowEditRoomModal(false);
      setEditingRoom(null);
      setRoomForm({ nomor_kamar: '', harga: '', status: 'available', description: '', capacity: 1, floor: 1, facilities: '', image: null });
      setError('');
      // Refresh complaints
      fetchComplaintsForRooms(updatedRooms);
    } catch (err) {
      console.error('Error editing room:', err);
      setError('Gagal mengupdate kamar');
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus kamar ini?')) return;
    
    try {
      await api.delete(`/kamar/${roomId}/`);
      const updatedRooms = rooms.filter(room => room.id !== roomId);
      setRooms(updatedRooms);
      setError('');
      // Remove complaints for deleted room and refresh kos details
      const newComplaints = { ...complaints };
      delete newComplaints[roomId];
      setComplaints(newComplaints);
      fetchKosDetails();
    } catch (err) {
      console.error('Error deleting room:', err);
      setError('Gagal menghapus kamar');
    }
  };

  const openEditModal = (room) => {
    setEditingRoom(room);
    setRoomForm({
      nomor_kamar: room.nomor_kamar || room.room_number,
      harga: room.harga || room.price,
      status: room.status,
      description: room.description || '',
      capacity: room.capacity || 1,
      floor: room.floor || 1,
      facilities: room.facilities || '',
      image: room.image || null,
    });
    setShowEditRoomModal(true);
  };

  const openAssignUserModal = (room) => {
    setAssigningRoom(room);
    setSelectedUserId(room.penyewa || '');
    setShowAssignUserModal(true);
  };

  // Get available users for assignment (not already assigned to other rooms)
  const getAvailableUsers = () => {
    if (!assigningRoom) return users;
    
    // Get all assigned penyewa IDs from rooms, excluding current room
    const assignedUserIds = rooms
      .filter(r => r.id !== assigningRoom.id && r.penyewa) // Exclude current room and rooms without penyewa
      .map(r => r.penyewa);
    
    // Filter users: show only those not assigned to other rooms
    return users.filter(user => !assignedUserIds.includes(user.id));
  };

  const handleAssignUser = async (e) => {
    e.preventDefault();
    try {
      const updateData = {
        kos: parseInt(kosId, 10),
        nomor_kamar: assigningRoom.nomor_kamar || assigningRoom.room_number,
        harga: assigningRoom.harga || assigningRoom.price,
        penyewa: selectedUserId ? parseInt(selectedUserId, 10) : null,
        status: selectedUserId ? 'occupied' : 'available',
      };
      
      const response = await api.put(`/kamar/${assigningRoom.id}/`, updateData);
      const updatedRooms = rooms.map(room => room.id === assigningRoom.id ? response.data : room);
      setRooms(updatedRooms);
      setShowAssignUserModal(false);
      setAssigningRoom(null);
      setSelectedUserId('');
      setError('');
    } catch (err) {
      console.error('Error assigning user:', err);
      setError(err.response?.data?.detail || 'Gagal assign user ke kamar');
    }
  };

  const handleRemoveUser = async (room) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus ${room.penyewa_username} dari kamar ini?`)) return;
    
    try {
      const updateData = {
        kos: parseInt(kosId, 10),
        nomor_kamar: room.nomor_kamar || room.room_number,
        harga: room.harga || room.price,
        penyewa: null,
        status: 'available',
      };
      
      const response = await api.put(`/kamar/${room.id}/`, updateData);
      const updatedRooms = rooms.map(r => r.id === room.id ? response.data : r);
      setRooms(updatedRooms);
      setError('');
    } catch (err) {
      console.error('Error removing user:', err);
      setError('Gagal menghapus user dari kamar');
    }
  };

  const openExtendRentalModal = (room) => {
    const rental = rentals[room.id];
    setExtendingRoom(room);
    setExtendForm({
      new_end_date: rental?.end_date || '',
      notes: '',
    });
    setShowExtendRentalModal(true);
  };

  const handleExtendRental = async (e) => {
    e.preventDefault();
    try {
      const rental = rentals[extendingRoom.id];
      if (!rental) {
        setError('Rental tidak ditemukan. Silakan buat rental baru.');
        return;
      }

      // Use custom extend endpoint that also creates payment record
      const response = await api.post(`/rental/${rental.id}/extend/`, {
        new_end_date: extendForm.new_end_date,
        notes: extendForm.notes,
      });

      // Update local rentals state with returned rental data
      setRentals({
        ...rentals,
        [extendingRoom.id]: response.data.rental,
      });

      setShowExtendRentalModal(false);
      setExtendingRoom(null);
      setExtendForm({ new_end_date: '', notes: '' });
      setError('');
      alert('Masa sewa berhasil diperpanjang, pembayaran tercatat, dan laporan keuangan diperbarui!');
    } catch (err) {
      console.error('Error extending rental:', err);
      setError(err.response?.data?.error || err.response?.data?.detail || 'Gagal memperpanjang masa sewa');
    }
  };

  const createRentalForRoom = async (room, endDate) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const roomPrice = room.harga || room.price;

      const response = await api.post('/rental/', {
        room: room.id,
        penyewa: room.penyewa,
        start_date: today,
        end_date: endDate,
        harga_bulanan: roomPrice,
        status: 'active',
      });

      setRentals({
        ...rentals,
        [room.id]: response.data,
      });

      return response.data;
    } catch (err) {
      console.error('Error creating rental:', err);
      throw err;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white flex items-center justify-center">
        <p className="text-gray-600">Memuat data...</p>
      </div>
    );
  }

  if (!kos) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Kos tidak ditemukan</p>
          <button
            onClick={() => navigate('/admin/fitur/rooms')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Kembali ke Daftar Kos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white">
      <SubHeader title="Detail Kos" backPath="/admin/fitur/rooms" />

      {/* Additional Action Button */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-4 flex justify-end">
        <button
          onClick={() => setShowAddRoomModal(true)}
          className="px-4 py-2 bg-cyan-500 text-white font-semibold rounded-lg hover:bg-cyan-600 transition-colors"
        >
          + Tambah Kamar
        </button>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumbs */}
        <div className="mb-6 flex items-center text-sm text-gray-600">
          <button
            onClick={() => navigate('/admin/fitur/rooms')}
            className="hover:text-blue-600 transition-colors"
          >
            Kelola Kos
          </button>
          <span className="mx-2">›</span>
          <span className="text-gray-900 font-semibold">{kos.name}</span>
        </div>

        {/* Kos Info Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{kos.name}</h1>
              <p className="text-gray-600 mb-4">
                <span className="inline-flex items-center">
                  {kos.address}
                </span>
              </p>
              <div className="flex gap-4">
                <div className="bg-blue-50 px-4 py-2 rounded-lg">
                  <p className="text-sm text-gray-600">Total Kamar</p>
                  <p className="text-2xl font-bold text-blue-600">{kos.room_count || rooms.length}</p>
                </div>
                <div className="bg-green-50 px-4 py-2 rounded-lg">
                  <p className="text-sm text-gray-600">Tersedia</p>
                  <p className="text-2xl font-bold text-green-600">
                    {rooms.filter(r => r.status === 'available').length}
                  </p>
                </div>
                <div className="bg-red-50 px-4 py-2 rounded-lg">
                  <p className="text-sm text-gray-600">Terisi</p>
                  <p className="text-2xl font-bold text-red-600">
                    {rooms.filter(r => r.status === 'occupied').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Rooms Grid */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Daftar Kamar</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.length === 0 ? (
              <div className="col-span-full text-center py-12 bg-white rounded-lg shadow-md">
                <p className="text-gray-500 text-lg mb-4">Belum ada kamar untuk kos ini</p>
                <button
                  onClick={() => setShowAddRoomModal(true)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  style={{ backgroundColor: '#00A5E8' }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#0088c7'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#00A5E8'}
                >
                  Tambah Kamar Pertama
                </button>
              </div>
            ) : (
              rooms.map(room => {
                const roomComplaints = complaints[room.id] || [];
                const pendingComplaints = roomComplaints.filter(c => c.status === 'pending' || c.status === 'in_progress');
                const roomNumber = room.nomor_kamar || room.room_number;
                const roomPrice = room.harga || room.price;
                const rental = rentals[room.id];
                const endDate = rental?.end_date;
                
                // Calculate days remaining
                const daysRemaining = endDate ? Math.ceil((new Date(endDate) - new Date()) / (1000 * 60 * 60 * 24)) : 0;
                const monthsRemaining = daysRemaining / 30;
                
                // Determine status
                const isExpired = daysRemaining < 0;
                const statusColor = isExpired ? 'red' : 
                                   monthsRemaining < 3 ? 'red' : 
                                   monthsRemaining < 6 ? 'yellow' : 'green';
                const statusText = isExpired ? 'Expired' : 
                                  monthsRemaining < 3 ? 'Kurang dari 3 Bulan' : 
                                  monthsRemaining < 6 ? '3-6 Bulan' : 'Lebih dari 6 Bulan';
                
                return (
                  <div key={room.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100">
                    <div className="h-48 relative overflow-hidden">
                      {room.image ? (
                        <img 
                          src={room.image} 
                          alt={`Kamar ${roomNumber}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center" />
                      )}
                      {pendingComplaints.length > 0 && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                          {pendingComplaints.length}
                        </div>
                      )}
                      {room.penyewa && (
                        <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                          Terisi
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl font-bold text-gray-900">Kamar {roomNumber}</h3>
                        <p className="text-xl font-bold text-blue-600" style={{ color: '#00A5E8' }}>
                          Rp {parseInt(roomPrice).toLocaleString('id-ID')}
                        </p>
                      </div>
                      <div className="mb-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                          room.status === 'available' ? 'bg-green-100 text-green-800' :
                          room.status === 'occupied' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {room.status === 'available' ? 'Tersedia' :
                           room.status === 'occupied' ? 'Ditempati' : 'Perbaikan'}
                        </span>
                      </div>
                      
                      {/* Facilities & Description */}
                      {(room.facilities || room.description) && (
                        <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                          {room.facilities && (
                            <div className="mb-2">
                              <p className="text-xs font-semibold text-gray-700 mb-1">Fasilitas:</p>
                              <p className="text-xs text-gray-600">{room.facilities}</p>
                            </div>
                          )}
                          {room.description && (
                            <div>
                              <p className="text-xs text-gray-600 italic">{room.description}</p>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Penyewa Info */}
                      {room.penyewa_username ? (
                        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className="text-xs text-gray-600 mb-1">Penyewa</p>
                              <p className="text-sm font-semibold text-gray-800">{room.penyewa_username}</p>
                            </div>
                            <button
                              onClick={() => handleRemoveUser(room)}
                              className="text-red-500 hover:text-red-700 text-xs font-medium"
                            >
                              Hapus
                            </button>
                          </div>
                          
                          {/* Rental End Date */}
                          {endDate ? (
                            <div className={`mt-2 p-2 rounded ${
                              statusColor === 'red' ? 'bg-red-100' : 
                              statusColor === 'yellow' ? 'bg-yellow-100' : 
                              'bg-green-100'
                            }`}>
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-xs text-gray-600">Sewa Berakhir</p>
                                  <p className={`text-sm font-bold ${
                                    statusColor === 'red' ? 'text-red-700' : 
                                    statusColor === 'yellow' ? 'text-yellow-700' : 
                                    'text-green-700'
                                  }`}>
                                    {new Date(endDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                  </p>
                                  <p className={`text-xs mt-1 ${
                                    statusColor === 'red' ? 'text-red-600' : 
                                    statusColor === 'yellow' ? 'text-yellow-600' : 
                                    'text-green-600'
                                  }`}>
                                    {statusText}
                                  </p>
                                </div>
                                <button
                                  onClick={() => openExtendRentalModal(room)}
                                  className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                                >
                                  Perpanjang
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="mt-2 p-2 bg-gray-100 rounded">
                              <div className="flex items-center justify-between">
                                <p className="text-xs text-gray-500">Belum ada data sewa</p>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={() => openAssignUserModal(room)}
                          className="w-full mb-4 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 text-sm font-semibold border-2 border-dashed border-green-300"
                        >
                          + Assign Penyewa
                        </button>
                      )}
                      
                      {/* Complaints Section */}
                      {roomComplaints.length > 0 && (
                        <div className="mb-4">
                          <p className="text-xs font-semibold text-gray-700 mb-2">Laporan Kerusakan ({roomComplaints.length})</p>
                          <div className="space-y-2 max-h-32 overflow-y-auto">
                            {roomComplaints.map(complaint => (
                              <div key={complaint.laporan_id} className={`text-xs p-2 rounded ${
                                complaint.status === 'resolved' ? 'bg-green-100 text-green-800' :
                                complaint.status === 'pending' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                <div className="font-semibold">{complaint.deskripsi.substring(0, 30)}...</div>
                                <div className="text-xs opacity-75">Status: {
                                  complaint.status === 'resolved' ? 'Selesai' :
                                  complaint.status === 'pending' ? 'Tertunda' :
                                  'Dikerjakan'
                                }</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(room)}
                          className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm font-semibold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteRoom(room.id)}
                          className="flex-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-sm font-semibold"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>

      {/* Add Room Modal */}
      {showAddRoomModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">Tambah Kamar Baru</h2>
            <form onSubmit={handleAddRoom}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                {/* Left Column */}
                <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Kamar</label>
                <input
                  type="text"
                  value={roomForm.nomor_kamar}
                  onChange={(e) => setRoomForm({ ...roomForm, nomor_kamar: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: 101"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Harga (Rp)</label>
                <input
                  type="number"
                  value={roomForm.harga}
                  onChange={(e) => setRoomForm({ ...roomForm, harga: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: 1000000"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lantai</label>
                <input
                  type="number"
                  value={roomForm.floor}
                  onChange={(e) => setRoomForm({ ...roomForm, floor: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: 1"
                  min="1"
                />
              </div>
                </div>
                
                {/* Right Column */}
                <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kapasitas</label>
                <input
                  type="number"
                  value={roomForm.capacity}
                  onChange={(e) => setRoomForm({ ...roomForm, capacity: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: 1"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
                <textarea
                  value={roomForm.description}
                  onChange={(e) => setRoomForm({ ...roomForm, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Deskripsi kamar"
                  rows="2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fasilitas</label>
                <textarea
                  value={roomForm.facilities}
                  onChange={(e) => setRoomForm({ ...roomForm, facilities: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: AC, WiFi, Kamar Mandi Dalam"
                  rows="2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gambar Kamar</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setRoomForm({ ...roomForm, image: e.target.files[0] })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
                </div>
              </div>
              
              {/* Status field full width */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={roomForm.status}
                  onChange={(e) => setRoomForm({ ...roomForm, status: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="available">Tersedia</option>
                  <option value="occupied">Ditempati</option>
                  <option value="maintenance">Perbaikan</option>
                </select>
              </div>
              {error && (
                <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}
              <div className="flex gap-3 justify-end mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddRoomModal(false);
                    setRoomForm({ nomor_kamar: '', harga: '', status: 'available', description: '', capacity: 1, floor: 1, facilities: '', image: null });
                    setError('');
                  }}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  style={{ backgroundColor: '#00A5E8' }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#0088c7'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#00A5E8'}
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Room Modal */}
      {showEditRoomModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">Edit Kamar</h2>
            <form onSubmit={handleEditRoom}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                {/* Left Column */}
                <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Kamar</label>
                <input
                  type="text"
                  value={roomForm.nomor_kamar}
                  onChange={(e) => setRoomForm({ ...roomForm, nomor_kamar: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Harga (Rp)</label>
                <input
                  type="number"
                  value={roomForm.harga}
                  onChange={(e) => setRoomForm({ ...roomForm, harga: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lantai</label>
                <input
                  type="number"
                  value={roomForm.floor}
                  onChange={(e) => setRoomForm({ ...roomForm, floor: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                />
              </div>
                </div>
                
                {/* Right Column */}
                <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kapasitas</label>
                <input
                  type="number"
                  value={roomForm.capacity}
                  onChange={(e) => setRoomForm({ ...roomForm, capacity: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
                <textarea
                  value={roomForm.description}
                  onChange={(e) => setRoomForm({ ...roomForm, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fasilitas</label>
                <textarea
                  value={roomForm.facilities}
                  onChange={(e) => setRoomForm({ ...roomForm, facilities: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Gambar Kamar</label>
                {roomForm.image && typeof roomForm.image === 'string' && (
                  <div className="mb-2">
                    <img src={roomForm.image} alt="Current" className="w-32 h-32 object-cover rounded" />
                    <p className="text-xs text-gray-500 mt-1">Gambar saat ini</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setRoomForm({ ...roomForm, image: e.target.files[0] })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
                </div>
              </div>
              
              {/* Status field full width */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={roomForm.status}
                  onChange={(e) => setRoomForm({ ...roomForm, status: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="available">Tersedia</option>
                  <option value="occupied">Ditempati</option>
                  <option value="maintenance">Perbaikan</option>
                </select>
              </div>
              {error && (
                <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}
              <div className="flex gap-3 justify-end mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditRoomModal(false);
                    setEditingRoom(null);
                    setRoomForm({ nomor_kamar: '', harga: '', status: 'available', description: '', capacity: 1, floor: 1, facilities: '', image: null });
                    setError('');
                  }}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  style={{ backgroundColor: '#00A5E8' }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#0088c7'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#00A5E8'}
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign User Modal */}
      {showAssignUserModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-2">Assign Penyewa</h2>
            <p className="text-gray-600 mb-6">Kamar {assigningRoom?.nomor_kamar || assigningRoom?.room_number}</p>
            <form onSubmit={handleAssignUser}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Penyewa</label>
                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Pilih Penyewa --</option>
                  {getAvailableUsers().map(user => (
                    <option key={user.id} value={user.id}>
                      {user.first_name} {user.last_name} ({user.username}) - {user.phone_number || 'No HP'}
                    </option>
                  ))}
                </select>
                {getAvailableUsers().length === 0 && (
                  <p className="text-sm text-red-500 mt-2">
                    Semua penyewa sudah terassign ke kamar lain. Hapus penyewa dari kamar lain terlebih dahulu atau{' '}
                    <button type="button" onClick={() => navigate('/admin/fitur/register')} className="text-blue-600 hover:underline">daftarkan penyewa baru</button>
                  </p>
                )}
                {getAvailableUsers().length > 0 && users.length > getAvailableUsers().length && (
                  <p className="text-sm text-gray-500 mt-2">
                    {users.length - getAvailableUsers().length} penyewa lainnya sudah terassign ke kamar lain
                  </p>
                )}
              </div>
              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  disabled={!selectedUserId}
                >
                  Assign
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAssignUserModal(false);
                    setAssigningRoom(null);
                    setSelectedUserId('');
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

      {/* Extend Rental Modal */}
      {showExtendRentalModal && extendingRoom && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-2">
              {rentals[extendingRoom.id] ? 'Perpanjang Masa Sewa' : 'Atur Masa Sewa'}
            </h2>
            <p className="text-gray-600 mb-4">
              Kamar {extendingRoom.nomor_kamar || extendingRoom.room_number} - {extendingRoom.penyewa_username}
            </p>

            {/* Current rental info */}
            {rentals[extendingRoom.id] && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Sewa saat ini berakhir:</p>
                <p className="text-lg font-bold text-blue-600">
                  {new Date(rentals[extendingRoom.id].end_date).toLocaleDateString('id-ID', { 
                    day: 'numeric', month: 'long', year: 'numeric' 
                  })}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Harga: Rp {parseInt(rentals[extendingRoom.id].harga_bulanan).toLocaleString('id-ID')}/bulan
                </p>
              </div>
            )}

            {/* Info about price change */}
            {rentals[extendingRoom.id] && 
              parseInt(rentals[extendingRoom.id].harga_bulanan) !== parseInt(extendingRoom.harga || extendingRoom.price) && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm font-semibold text-yellow-800">⚠️ Perubahan Harga</p>
                <p className="text-xs text-yellow-700 mt-1">
                  Harga kamar saat ini: <strong>Rp {parseInt(extendingRoom.harga || extendingRoom.price).toLocaleString('id-ID')}</strong>
                  <br />
                  Harga di rental: <strong>Rp {parseInt(rentals[extendingRoom.id].harga_bulanan).toLocaleString('id-ID')}</strong>
                </p>
                <p className="text-xs text-yellow-600 mt-2">
                  Perpanjangan akan tetap menggunakan harga rental yang ada. 
                  Untuk menerapkan harga baru, buat rental baru setelah rental ini berakhir.
                </p>
              </div>
            )}

            <form onSubmit={async (e) => {
              e.preventDefault();
              if (rentals[extendingRoom.id]) {
                await handleExtendRental(e);
              } else {
                // Create new rental
                try {
                  await createRentalForRoom(extendingRoom, extendForm.new_end_date);
                  setShowExtendRentalModal(false);
                  setExtendingRoom(null);
                  setExtendForm({ new_end_date: '', notes: '' });
                  setError('');
                  alert('Data sewa berhasil dibuat!');
                } catch (err) {
                  setError('Gagal membuat data sewa');
                }
              }
            }}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal Berakhir Baru
                </label>
                <input
                  type="date"
                  value={extendForm.new_end_date}
                  onChange={(e) => setExtendForm({ ...extendForm, new_end_date: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min={rentals[extendingRoom.id]?.end_date || new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catatan (Opsional)
                </label>
                <textarea
                  value={extendForm.notes}
                  onChange={(e) => setExtendForm({ ...extendForm, notes: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="2"
                  placeholder="Contoh: Perpanjangan 3 bulan"
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
                >
                  {rentals[extendingRoom.id] ? 'Perpanjang Sewa' : 'Simpan'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowExtendRentalModal(false);
                    setExtendingRoom(null);
                    setExtendForm({ new_end_date: '', notes: '' });
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
