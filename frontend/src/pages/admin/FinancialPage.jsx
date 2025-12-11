import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import dashboardService from '../../services/dashboardService';

export default function FinancialPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [invoiceForm, setInvoiceForm] = useState({
    kamar: '',
    amount: '',
    description: '',
    due_date: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [invoicesData, roomsData] = await Promise.all([
        dashboardService.getInvoices(),
        dashboardService.getRooms(),
      ]);
      setInvoices(invoicesData || []);
      setRooms(roomsData || []);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/invoice/', {
        ...invoiceForm,
        kamar: parseInt(invoiceForm.kamar, 10),
        amount: parseFloat(invoiceForm.amount),
        status: 'pending',
      });
      setInvoices([...invoices, response.data]);
      setShowCreateModal(false);
      setInvoiceForm({ kamar: '', amount: '', description: '', due_date: '' });
      setError('');
    } catch (err) {
      console.error('Error creating invoice:', err);
      setError(err.response?.data?.detail || 'Gagal membuat tagihan');
    }
  };

  const handleMarkAsPaid = async (invoiceId) => {
    try {
      await api.patch(`/invoice/${invoiceId}/`, { status: 'paid' });
      setInvoices(invoices.map(inv => 
        inv.id === invoiceId ? { ...inv, status: 'paid' } : inv
      ));
    } catch (err) {
      console.error('Error updating invoice:', err);
    }
  };

  const handleDeleteInvoice = async (invoiceId) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus tagihan ini?')) return;
    try {
      await api.delete(`/invoice/${invoiceId}/`);
      setInvoices(invoices.filter(inv => inv.id !== invoiceId));
    } catch (err) {
      console.error('Error deleting invoice:', err);
    }
  };

  // Calculate statistics
  const totalIncome = invoices
    .filter(inv => inv.status === 'paid' || inv.status === 'lunas')
    .reduce((sum, inv) => sum + parseFloat(inv.amount || inv.total || 0), 0);
  
  const pendingAmount = invoices
    .filter(inv => inv.status === 'pending' || inv.status === 'belum_lunas')
    .reduce((sum, inv) => sum + parseFloat(inv.amount || inv.total || 0), 0);

  const paidCount = invoices.filter(inv => inv.status === 'paid' || inv.status === 'lunas').length;
  const pendingCount = invoices.filter(inv => inv.status === 'pending' || inv.status === 'belum_lunas').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
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
            <span className="font-semibold tracking-wide text-white">Laporan Keuangan</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              + Buat Tagihan
            </button>
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
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="text-emerald-100 text-sm font-medium">Total Pendapatan</p>
              <span className="text-2xl">💰</span>
            </div>
            <p className="text-3xl font-bold">Rp {totalIncome.toLocaleString('id-ID')}</p>
            <p className="text-emerald-200 text-sm mt-2">Dari {paidCount} pembayaran</p>
          </div>
          
          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="text-yellow-100 text-sm font-medium">Menunggu Pembayaran</p>
              <span className="text-2xl">⏳</span>
            </div>
            <p className="text-3xl font-bold">Rp {pendingAmount.toLocaleString('id-ID')}</p>
            <p className="text-yellow-200 text-sm mt-2">{pendingCount} tagihan tertunda</p>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="text-blue-100 text-sm font-medium">Total Tagihan</p>
              <span className="text-2xl">📄</span>
            </div>
            <p className="text-3xl font-bold">{invoices.length}</p>
            <p className="text-blue-200 text-sm mt-2">Semua periode</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="text-purple-100 text-sm font-medium">Tingkat Pembayaran</p>
              <span className="text-2xl">📊</span>
            </div>
            <p className="text-3xl font-bold">
              {invoices.length > 0 ? Math.round((paidCount / invoices.length) * 100) : 0}%
            </p>
            <p className="text-purple-200 text-sm mt-2">Lunas tepat waktu</p>
          </div>
        </div>

        {/* Invoices Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-800">Daftar Tagihan</h2>
          </div>
          
          {invoices.length === 0 ? (
            <div className="p-12 text-center">
              <span className="text-6xl mb-4 block">📋</span>
              <p className="text-gray-500 text-lg mb-4">Belum ada tagihan</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
              >
                Buat Tagihan Pertama
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Kamar</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Deskripsi</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Jumlah</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Jatuh Tempo</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {invoices.map(invoice => (
                    <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-800">
                          Kamar {invoice.kamar_detail?.room_number || invoice.kamar_detail?.nomor_kamar || invoice.kamar}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {invoice.description || 'Tagihan Sewa Bulanan'}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-gray-800">
                          Rp {parseFloat(invoice.amount || invoice.total || 0).toLocaleString('id-ID')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {invoice.due_date || '-'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                          invoice.status === 'paid' || invoice.status === 'lunas'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {invoice.status === 'paid' || invoice.status === 'lunas' ? '✓ Lunas' : '⏳ Belum Lunas'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {(invoice.status === 'pending' || invoice.status === 'belum_lunas') && (
                            <button
                              onClick={() => handleMarkAsPaid(invoice.id)}
                              className="px-3 py-1 bg-green-100 text-green-600 rounded-lg text-sm hover:bg-green-200 transition-colors"
                            >
                              Tandai Lunas
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteInvoice(invoice.id)}
                            className="px-3 py-1 bg-red-100 text-red-600 rounded-lg text-sm hover:bg-red-200 transition-colors"
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
      </main>

      {/* Create Invoice Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">Buat Tagihan Baru</h2>
            <form onSubmit={handleCreateInvoice}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Kamar</label>
                <select
                  value={invoiceForm.kamar}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, kamar: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">-- Pilih Kamar --</option>
                  {rooms.filter(r => r.penyewa).map(room => (
                    <option key={room.id} value={room.id}>
                      Kamar {room.room_number || room.nomor_kamar} - {room.penyewa_username}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Jumlah (Rp)</label>
                <input
                  type="number"
                  value={invoiceForm.amount}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, amount: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: 1000000"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
                <input
                  type="text"
                  value={invoiceForm.description}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, description: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: Tagihan Sewa Bulan Desember"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Jatuh Tempo</label>
                <input
                  type="date"
                  value={invoiceForm.due_date}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, due_date: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="flex-1 px-4 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 font-semibold transition-colors"
                >
                  Buat Tagihan
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setInvoiceForm({ kamar: '', amount: '', description: '', due_date: '' });
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
