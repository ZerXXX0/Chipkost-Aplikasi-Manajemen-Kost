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

<<<<<<< Updated upstream
=======
  // Auto-check pending payments on load - only once
  const hasCheckedRef = useRef(false);
  useEffect(() => {
    const checkPendingPayments = async () => {
      // Only check once per page load
      if (hasCheckedRef.current) return;
      hasCheckedRef.current = true;
      
      const pendingPayments = payments.filter(p => p.status === 'pending' && p.transaction_id);
      for (const payment of pendingPayments) {
        try {
          const response = await api.post('/pembayaran/check-transaction/', {
            order_id: payment.transaction_id
          });
          console.log(`Checked ${payment.transaction_id}:`, response.data.transaction_status);
          
          if (response.data.transaction_status === 'settlement' || 
              response.data.transaction_status === 'capture') {
            // Refresh data if any payment was settled
            fetchData();
            break;
          }
        } catch (err) {
          console.error('Auto-check error:', err);
        }
      }
    };

    if (payments.length > 0) {
      checkPendingPayments();
    }
  }, [payments.length]);

  const deleteInvoice = async (invoiceId) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus tagihan ini?\n\nTagihan yang dihapus akan hilang dari riwayat dan laporan keuangan.')) {
      return;
    }

    try {
      await api.delete(`/invoice/${invoiceId}/`);
      // Refresh data after deletion
      fetchData();
      alert('Tagihan berhasil dihapus');
    } catch (err) {
      console.error('Error deleting invoice:', err);
      alert('Gagal menghapus tagihan: ' + (err.response?.data?.error || err.message));
    }
  };

<<<<<<< Updated upstream
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
        </div>
      )}
=======
        )}

        {/* Paid Invoices / Tagihan Yang Sudah Dibayar */}
        {paidInvoices.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Tagihan Yang Sudah Dibayar</h2>
            <div className="space-y-3">
              {paidInvoices.map(invoice => (
                <div key={invoice.id} className="bg-white rounded-xl shadow p-4 border-l-4 border-green-500">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-gray-800">Invoice #{invoice.invoice_number}</p>
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                          LUNAS
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">{invoice.notes || 'Tagihan Sewa Kos'}</p>
                      <p className="text-gray-500 text-sm">
                        Periode: {formatDate(invoice.billing_period_start)} - {formatDate(invoice.billing_period_end)}
                      </p>
                      {invoice.due_date && (
                        <p className="text-sm text-gray-400">
                          Jatuh Tempo: {formatDate(invoice.due_date)}
                        </p>
                      )}
                    </div>
                    <div className="text-right flex flex-col items-end gap-2">
                      <div>
                        <p className="font-bold text-xl text-gray-800">{formatCurrency(invoice.amount)}</p>
                        <span className="inline-flex px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                          Lunas
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => downloadInvoice(invoice.id)}
                          className="px-3 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Download
                        </button>
                        <button
                          onClick={() => deleteInvoice(invoice.id)}
                          className="px-3 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                          title="Hapus tagihan"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pending Payments */}
        {pendingPayments.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Pembayaran Tertunda</h2>
            <div className="space-y-3">
              {pendingPayments.map(payment => (
                <div key={payment.pembayaran_id} className="bg-white rounded-xl shadow p-4 border-l-4 border-yellow-500">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{payment.notes || 'Pembayaran Sewa'}</p>
                      <p className="text-gray-500 text-sm">{formatDate(payment.tgl_bayar)}</p>
                      <p className="text-xs text-gray-400">ID: {payment.transaction_id}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-bold text-gray-800">{formatCurrency(payment.jumlah)}</p>
                        <span className="inline-flex px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                          Menunggu
                        </span>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => checkPendingPaymentStatus(payment.transaction_id)}
                          disabled={checkingPaymentId === payment.transaction_id || cancellingPaymentId === payment.pembayaran_id}
                          className="px-3 py-2 bg-cyan-500 text-white text-sm font-medium rounded-lg hover:bg-cyan-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                        >
                          {checkingPaymentId === payment.transaction_id ? (
                            <span className="flex items-center gap-1">
                              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                              Mengecek...
                            </span>
                          ) : (
                            'Cek Status'
                          )}
                        </button>
                        <button
                          onClick={() => cancelPayment(payment.pembayaran_id)}
                          disabled={checkingPaymentId === payment.transaction_id || cancellingPaymentId === payment.pembayaran_id}
                          className="px-3 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                        >
                          {cancellingPaymentId === payment.pembayaran_id ? (
                            <span className="flex items-center gap-1">
                              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                              Membatalkan...
                            </span>
                          ) : (
                            'Batalkan'
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}


      </main>
>>>>>>> Stashed changes
    </div>
  );
}
