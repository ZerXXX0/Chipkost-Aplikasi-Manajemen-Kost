import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import dashboardService from '../../services/dashboardService';

export default function PaymentsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [myRoom, setMyRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('transfer');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [invoicesData, roomData] = await Promise.all([
        dashboardService.getInvoices(),
        dashboardService.getMyRoom(),
      ]);
      setInvoices(invoicesData || []);
      setMyRoom(roomData);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async () => {
    if (!selectedInvoice) return;
    try {
      await api.patch(`/invoice/${selectedInvoice.id}/`, { 
        status: 'paid',
        payment_method: paymentMethod 
      });
      setInvoices(invoices.map(inv => 
        inv.id === selectedInvoice.id ? { ...inv, status: 'paid' } : inv
      ));
      setShowPayModal(false);
      setSelectedInvoice(null);
    } catch (err) {
      console.error('Error paying invoice:', err);
    }
  };

  const openPayModal = (invoice) => {
    setSelectedInvoice(invoice);
    setShowPayModal(true);
  };

  // Stats
  const pendingInvoices = invoices.filter(inv => inv.status === 'pending' || inv.status === 'belum_lunas');
  const paidInvoices = invoices.filter(inv => inv.status === 'paid' || inv.status === 'lunas');
  const totalPending = pendingInvoices.reduce((sum, inv) => sum + parseFloat(inv.amount || inv.total || 0), 0);

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
              onClick={() => navigate('/penyewa/fitur')}
              className="text-white hover:text-white/80 text-xl"
            >
              ←
            </button>
            <span className="font-semibold tracking-wide text-white">Pembayaran Sewa</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right leading-tight">
              <div className="text-sm text-white">{user?.first_name || 'User'}</div>
              <div className="text-xs text-white/80">Penyewa</div>
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Room Info */}
        {myRoom && (
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg mb-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Kamar Anda</p>
                <p className="text-4xl font-bold">{myRoom.room_number || myRoom.nomor_kamar}</p>
                <p className="text-blue-200 text-sm mt-1">📍 {myRoom.kos_name}</p>
              </div>
              <div className="text-right">
                <p className="text-blue-100 text-sm">Biaya Bulanan</p>
                <p className="text-2xl font-bold">Rp {parseInt(myRoom.price || myRoom.harga || 0).toLocaleString('id-ID')}</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-yellow-500">
            <p className="text-gray-500 text-sm font-medium">Tagihan Menunggu</p>
            <p className="text-3xl font-bold text-yellow-600">{pendingInvoices.length}</p>
            <p className="text-gray-400 text-sm mt-1">Total: Rp {totalPending.toLocaleString('id-ID')}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-green-500">
            <p className="text-gray-500 text-sm font-medium">Sudah Dibayar</p>
            <p className="text-3xl font-bold text-green-600">{paidInvoices.length}</p>
            <p className="text-gray-400 text-sm mt-1">Pembayaran lunas</p>
          </div>
        </div>

        {/* Pending Invoices */}
        {pendingInvoices.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Tagihan Menunggu Pembayaran</h2>
            <div className="space-y-4">
              {pendingInvoices.map(invoice => (
                <div key={invoice.id} className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-yellow-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-800">{invoice.description || 'Tagihan Sewa Bulanan'}</p>
                      <p className="text-gray-500 text-sm mt-1">Jatuh tempo: {invoice.due_date || '-'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-800">
                        Rp {parseFloat(invoice.amount || invoice.total || 0).toLocaleString('id-ID')}
                      </p>
                      <button
                        onClick={() => openPayModal(invoice)}
                        className="mt-2 px-6 py-2 bg-emerald-500 text-white rounded-lg font-semibold hover:bg-emerald-600 transition-colors"
                      >
                        Bayar Sekarang
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payment History */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Riwayat Pembayaran</h2>
          {paidInvoices.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <span className="text-6xl mb-4 block">💳</span>
              <p className="text-gray-500">Belum ada riwayat pembayaran</p>
            </div>
          ) : (
            <div className="space-y-3">
              {paidInvoices.map(invoice => (
                <div key={invoice.id} className="bg-white rounded-xl shadow p-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">{invoice.description || 'Tagihan Sewa Bulanan'}</p>
                    <p className="text-gray-500 text-sm">{invoice.paid_at || invoice.updated_at || '-'}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800">
                      Rp {parseFloat(invoice.amount || invoice.total || 0).toLocaleString('id-ID')}
                    </p>
                    <span className="inline-flex px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                      ✓ Lunas
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Payment Modal */}
      {showPayModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <h2 className="text-2xl font-bold mb-2">Konfirmasi Pembayaran</h2>
            <p className="text-gray-500 mb-6">{selectedInvoice.description || 'Tagihan Sewa Bulanan'}</p>
            
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <p className="text-gray-500 text-sm">Total Pembayaran</p>
              <p className="text-3xl font-bold text-gray-800">
                Rp {parseFloat(selectedInvoice.amount || selectedInvoice.total || 0).toLocaleString('id-ID')}
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Metode Pembayaran</label>
              <div className="space-y-2">
                {[
                  { id: 'transfer', label: '🏦 Transfer Bank', desc: 'BCA, Mandiri, BNI, BRI' },
                  { id: 'ewallet', label: '📱 E-Wallet', desc: 'GoPay, OVO, Dana' },
                  { id: 'cash', label: '💵 Tunai', desc: 'Bayar langsung ke pemilik' },
                ].map(method => (
                  <label
                    key={method.id}
                    className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                      paymentMethod === method.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{method.label}</p>
                      <p className="text-gray-500 text-sm">{method.desc}</p>
                    </div>
                    {paymentMethod === method.id && (
                      <span className="text-blue-500 text-xl">✓</span>
                    )}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handlePay}
                className="flex-1 px-4 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 font-semibold transition-colors"
              >
                Konfirmasi Bayar
              </button>
              <button
                onClick={() => {
                  setShowPayModal(false);
                  setSelectedInvoice(null);
                }}
                className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold transition-colors"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
