import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SubHeader from '../../components/dashboard/SubHeader';
import api from '../../services/api';

export default function PaymentsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [rentalInfo, setRentalInfo] = useState(null);
  const [payments, setPayments] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonths, setSelectedMonths] = useState(1);
  const [paymentStatus, setPaymentStatus] = useState('idle'); // idle, processing, success, failed
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState(null);
  const [checkingPaymentId, setCheckingPaymentId] = useState(null);
  const [cancellingPaymentId, setCancellingPaymentId] = useState(null);
  const [cancelNotification, setCancelNotification] = useState(null);
  const [snapReady, setSnapReady] = useState(false);
  const isSnapOpenRef = useRef(false); // Track if snap popup is currently open

  // Check if Midtrans Snap is loaded
  useEffect(() => {
    const checkSnap = () => {
      if (window.snap && typeof window.snap.pay === 'function') {
        console.log('Midtrans Snap is ready');
        setSnapReady(true);
      } else {
        console.log('Waiting for Midtrans Snap to load...');
        setTimeout(checkSnap, 500);
      }
    };
    checkSnap();
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

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

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Get rental info with payment options, payments, and invoices
      const [rentalRes, paymentsRes, invoicesRes] = await Promise.all([
        api.get('/pembayaran/rental-info/').catch(err => ({ data: null, error: err })),
        api.get('/pembayaran/').then(res => res.data).catch(() => []),
        api.get('/invoice/').then(res => res.data).catch(() => [])
      ]);
      
      if (rentalRes.data && !rentalRes.error) {
        setRentalInfo(rentalRes.data);
      }
      
      setPayments(Array.isArray(paymentsRes) ? paymentsRes : paymentsRes?.results || []);
      setInvoices(Array.isArray(invoicesRes) ? invoicesRes : invoicesRes?.results || []);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!rentalInfo) return;
    
    // Prevent double-clicking while processing or popup is open
    if (paymentStatus === 'processing' || paymentStatus === 'popup_open' || isSnapOpenRef.current) {
      console.log('Payment already in progress, ignoring click');
      return;
    }
    
    // Check if Midtrans Snap is available
    if (!window.snap) {
      setError('Midtrans Snap belum dimuat. Silakan refresh halaman.');
      return;
    }
    
    try {
      setPaymentStatus('processing');
      setError('');
      
      // Create Midtrans Snap transaction
      const response = await api.post('/pembayaran/create-snap-transaction/', {
        rental_id: rentalInfo.rental_id,
        payment_months: selectedMonths
      });
      
      const { snap_token, order_id, existing, message, redirect_url } = response.data;
      
      // If there's an existing pending transaction
      if (existing) {
        // If we have a redirect URL, use it
        if (redirect_url) {
          console.log('Existing transaction found, redirecting to:', redirect_url);
          window.location.href = redirect_url;
          return;
        }
        // Otherwise show message
        setError(message || 'Transaksi pending sudah ada. Silakan cek status atau batalkan terlebih dahulu.');
        setPaymentStatus('idle');
        isSnapOpenRef.current = false;
        fetchData(); // Refresh data to show pending payment
        return;
      }
      
      // Validate snap_token
      if (!snap_token) {
        setError('Gagal mendapatkan token pembayaran. Silakan coba lagi.');
        setPaymentStatus('idle');
        return;
      }
      
      console.log('Snap token received:', snap_token);
      console.log('Order ID:', order_id);
      console.log('window.snap available:', !!window.snap);
      console.log('window.snap.pay available:', typeof window.snap?.pay);
      
      // Set status to show popup is open - prevents double-clicking
      setPaymentStatus('popup_open');
      isSnapOpenRef.current = true;
      
      // Set timeout to reset state if snap doesn't respond in 60 seconds
      const timeoutId = setTimeout(() => {
        if (isSnapOpenRef.current) {
          console.log('Snap timeout - resetting state');
          isSnapOpenRef.current = false;
          setPaymentStatus('idle');
          setError('Timeout: Popup pembayaran tidak merespons. Kemungkinan pop-up blocker aktif. Silakan izinkan pop-up dan coba lagi.');
        }
      }, 60000);
      
      // Open Midtrans Snap popup using embed mode (redirect URL)
      console.log('Calling window.snap.pay...');
      
      // Check if snap is properly initialized
      if (typeof window.snap?.pay !== 'function') {
        clearTimeout(timeoutId);
        isSnapOpenRef.current = false;
        setPaymentStatus('idle');
        // Fallback: Open redirect URL in new tab
        const redirectUrl = response.data.redirect_url;
        if (redirectUrl) {
          window.open(redirectUrl, '_blank');
          setError('Popup tidak tersedia. Halaman pembayaran dibuka di tab baru.');
        } else {
          setError('Midtrans Snap tidak tersedia. Silakan refresh halaman (Ctrl+Shift+R).');
        }
        return;
      }
      
      try {
        window.snap.pay(snap_token, {
          onSuccess: function(result) {
            clearTimeout(timeoutId);
            console.log('Payment success:', result);
            isSnapOpenRef.current = false;
            handlePaymentResult(order_id, 'success', result);
          },
          onPending: function(result) {
            clearTimeout(timeoutId);
            console.log('Payment pending:', result);
            isSnapOpenRef.current = false;
            handlePaymentResult(order_id, 'pending', result);
          },
          onError: function(result) {
            clearTimeout(timeoutId);
            console.log('Payment error:', result);
            isSnapOpenRef.current = false;
            handlePaymentResult(order_id, 'error', result);
          },
          onClose: function() {
            clearTimeout(timeoutId);
            console.log('Payment popup closed');
            isSnapOpenRef.current = false;
            setPaymentStatus('idle');
            // Check transaction status when popup closed
            checkTransactionStatus(order_id);
          }
        });
        console.log('window.snap.pay called successfully');
      } catch (snapError) {
        clearTimeout(timeoutId);
        console.error('Snap.pay error:', snapError);
        isSnapOpenRef.current = false;
        setPaymentStatus('idle');
        // Fallback: Open redirect URL in same window
        const redirectUrl = response.data.redirect_url;
        if (redirectUrl) {
          // Use same window redirect instead of popup
          window.location.href = redirectUrl;
        } else {
          setError('Gagal membuka popup pembayaran: ' + snapError.message);
        }
      }
      
    } catch (err) {
      console.error('Error creating transaction:', err);
      isSnapOpenRef.current = false;
      setError(err.response?.data?.error || 'Gagal membuat transaksi. Silakan coba lagi.');
      setPaymentStatus('idle'); // Reset to idle so user can try again
    }
  };

  const handlePaymentResult = async (orderId, status, result) => {
    if (status === 'success') {
      // Verify with backend
      try {
        const checkRes = await api.post('/pembayaran/check-transaction/', {
          order_id: orderId
        });
        
        setSuccessData({
          ...checkRes.data,
          selectedMonths
        });
        setPaymentStatus('success');
        
        // Refresh data after success
        setTimeout(() => {
          fetchData();
        }, 3000);
        
      } catch (err) {
        console.error('Error checking transaction:', err);
      }
    } else if (status === 'pending') {
      setPaymentStatus('pending');
      fetchData();
    } else {
      setPaymentStatus('failed');
      setError('Pembayaran gagal atau dibatalkan');
    }
  };

  const checkTransactionStatus = async (orderId) => {
    try {
      const response = await api.post('/pembayaran/check-transaction/', {
        order_id: orderId
      });
      
      if (response.data.transaction_status === 'settlement' || 
          response.data.transaction_status === 'capture') {
        setSuccessData({
          ...response.data,
          selectedMonths
        });
        setPaymentStatus('success');
        fetchData();
      } else if (response.data.transaction_status === 'pending') {
        setPaymentStatus('pending');
        fetchData();
      }
    } catch (err) {
      console.error('Error checking status:', err);
    }
  };

  // Check pending payment status manually
  const checkPendingPaymentStatus = async (transactionId) => {
    setCheckingPaymentId(transactionId);
    try {
      const response = await api.post('/pembayaran/check-transaction/', {
        order_id: transactionId
      });
      
      console.log('Check payment response:', response.data);
      
      if (response.data.transaction_status === 'settlement' || 
          response.data.transaction_status === 'capture') {
        // Payment successful, refresh data
        await fetchData();
        alert('Pembayaran berhasil diverifikasi!');
      } else if (response.data.transaction_status === 'pending') {
        alert('Pembayaran masih dalam proses. Silakan coba lagi nanti.');
      } else if (response.data.transaction_status === 'expire') {
        alert('Pembayaran sudah expired. Silakan buat transaksi baru.');
        await fetchData();
      } else {
        alert(`Status pembayaran: ${response.data.transaction_status || 'Tidak diketahui'}`);
      }
    } catch (err) {
      console.error('Error checking payment:', err);
      console.error('Error response:', err.response?.data);
      alert(`Gagal mengecek status pembayaran: ${err.response?.data?.error || err.message}`);
    } finally {
      setCheckingPaymentId(null);
    }
  };

  // Cancel pending payment
  const cancelPayment = async (paymentId) => {
    if (!confirm('Apakah Anda yakin ingin membatalkan pembayaran ini?')) {
      return;
    }

    // Find payment data before cancelling
    const payment = payments.find(p => p.pembayaran_id === paymentId);

    setCancellingPaymentId(paymentId);
    try {
      const response = await api.post(`/pembayaran/${paymentId}/cancel/`);

      if (response.data.success) {
        // Set cancel notification with payment data
        setCancelNotification({
          amount: payment?.jumlah || 0,
          notes: payment?.notes || 'Pembayaran Sewa',
          transactionId: payment?.transaction_id
        });
        
        // Refresh data
        await fetchData();
        
        // Auto-hide notification after 10 seconds
        setTimeout(() => {
          setCancelNotification(null);
        }, 10000);
      }
    } catch (err) {
      console.error('Error cancelling payment:', err);
      alert(`Gagal membatalkan pembayaran: ${err.response?.data?.error || err.message}`);
    } finally {
      setCancellingPaymentId(null);
    }
  };

  const formatCurrency = (amount) => {
    return `Rp ${parseInt(amount || 0).toLocaleString('id-ID')}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getSelectedOption = () => {
    if (!rentalInfo?.payment_options) return null;
    return rentalInfo.payment_options.find(opt => opt.months === selectedMonths);
  };

  // Download invoice with authentication
  const downloadInvoice = async (invoiceId) => {
    try {
      const response = await api.get(`/invoice/${invoiceId}/export/`, {
        responseType: 'text'
      });
      
      // Open HTML in new window
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.write(response.data);
        newWindow.document.close();
      } else {
        alert('Popup diblokir. Izinkan popup untuk download invoice.');
      }
    } catch (error) {
      console.error('Error downloading invoice:', error);
      alert('Gagal download invoice: ' + (error.response?.data?.error || error.message));
    }
  };

  // Filter payments and invoices (exclude cancelled invoices)
  const completedPayments = payments.filter(p => p.status === 'completed');
  const pendingPayments = payments.filter(p => p.status === 'pending');
  const unpaidInvoices = invoices.filter(inv => (inv.status === 'unpaid' || inv.status === 'overdue') && inv.status !== 'cancelled');
  const paidInvoices = invoices.filter(inv => inv.status === 'paid');

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
      <SubHeader title="Pembayaran Sewa" backPath="/penyewa/fitur" />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Cancel Notification */}
        {cancelNotification && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-red-700 mb-1">Pembayaran Dibatalkan</h3>
                  <p className="text-red-600 mb-2">{cancelNotification.notes}</p>
                  <p className="text-sm text-red-500">Jumlah: {formatCurrency(cancelNotification.amount)}</p>
                  <p className="text-xs text-red-400 mt-1">ID Transaksi: {cancelNotification.transactionId}</p>
                </div>
              </div>
              <button
                onClick={() => setCancelNotification(null)}
                className="text-red-400 hover:text-red-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
        
        {/* Success Message */}
        {paymentStatus === 'success' && successData && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-green-700 mb-2">Pembayaran Berhasil!</h3>
            <p className="text-green-600 mb-4">
              Pembayaran untuk {successData.selectedMonths} bulan telah berhasil.
            </p>
            {successData.period_end && (
              <p className="text-gray-600">
                Periode sewa Anda diperpanjang sampai <strong>{formatDate(successData.period_end)}</strong>
              </p>
            )}
            <button
              onClick={() => {
                setPaymentStatus('idle');
                setSuccessData(null);
              }}
              className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Tutup
            </button>
          </div>
        )}

        {/* Pending Payment Alert */}
        {paymentStatus === 'pending' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-bold text-yellow-700 mb-2">Menunggu Pembayaran</h3>
            <p className="text-yellow-600">
              Pembayaran Anda sedang diproses. Silakan selesaikan pembayaran sesuai instruksi dari Midtrans.
            </p>
          </div>
        )}

        {/* Room & Rental Info */}
        {rentalInfo ? (
          <>
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-6 text-white shadow-lg mb-8">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="text-blue-100 text-sm">Kamar Anda</p>
                  <p className="text-4xl font-bold">{rentalInfo.room_number}</p>
                  <p className="text-blue-200 text-sm mt-1">{rentalInfo.kos_name}</p>
                </div>
                <div className="text-right">
                  <p className="text-blue-100 text-sm">Biaya Bulanan</p>
                  <p className="text-2xl font-bold">{formatCurrency(rentalInfo.monthly_price)}</p>
                  {rentalInfo.current_end_date && (
                    <p className="text-blue-200 text-sm mt-2">
                      Sewa sampai: {formatDate(rentalInfo.current_end_date)}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Extension Billing Alert - Show when user needs to extend (less than 6 months remaining) */}
            {rentalInfo.extension_billing && (
              <div className={`rounded-2xl p-6 mb-8 border-2 ${
                rentalInfo.extension_billing.urgency_level === 'critical'
                  ? 'bg-red-50 border-red-300'
                  : rentalInfo.extension_billing.urgency_level === 'warning'
                    ? 'bg-amber-50 border-amber-300'
                    : 'bg-blue-50 border-blue-300'
              }`}>
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 ${
                    rentalInfo.extension_billing.urgency_level === 'critical'
                      ? 'bg-red-100'
                      : rentalInfo.extension_billing.urgency_level === 'warning'
                        ? 'bg-amber-100'
                        : 'bg-blue-100'
                  }`}>
                    <svg className={`w-7 h-7 ${
                      rentalInfo.extension_billing.urgency_level === 'critical'
                        ? 'text-red-600'
                        : rentalInfo.extension_billing.urgency_level === 'warning'
                          ? 'text-amber-600'
                          : 'text-blue-600'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className={`text-lg font-bold ${
                        rentalInfo.extension_billing.urgency_level === 'critical'
                          ? 'text-red-700'
                          : rentalInfo.extension_billing.urgency_level === 'warning'
                            ? 'text-amber-700'
                            : 'text-blue-700'
                      }`}>
                        Tagihan Perpanjangan Kos
                      </h3>
                      {rentalInfo.extension_billing.urgency_level === 'critical' && (
                        <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
                          SEGERA BAYAR
                        </span>
                      )}
                      {rentalInfo.extension_billing.urgency_level === 'warning' && (
                        <span className="px-2 py-1 bg-amber-500 text-white text-xs font-bold rounded-full">
                          PERLU PERHATIAN
                        </span>
                      )}
                    </div>
                    <p className={`mb-3 ${
                      rentalInfo.extension_billing.urgency_level === 'critical'
                        ? 'text-red-600'
                        : rentalInfo.extension_billing.urgency_level === 'warning'
                          ? 'text-amber-600'
                          : 'text-blue-600'
                    }`}>
                      Masa sewa Anda akan berakhir dalam <strong>{rentalInfo.extension_billing.remaining_days} hari</strong> ({rentalInfo.extension_billing.remaining_months || Math.round(rentalInfo.extension_billing.remaining_days / 30)} bulan).
                      {rentalInfo.extension_billing.urgency_level === 'critical'
                        ? ' Segera bayar perpanjangan!'
                        : rentalInfo.extension_billing.urgency_level === 'warning'
                          ? ' Sebaiknya segera perpanjang.'
                          : ' Perpanjang sekarang untuk kenyamanan Anda.'}
                    </p>
                    <div className={`rounded-xl p-4 mb-3 ${
                      rentalInfo.extension_billing.urgency_level === 'critical'
                        ? 'bg-red-100'
                        : rentalInfo.extension_billing.urgency_level === 'warning'
                          ? 'bg-amber-100'
                          : 'bg-blue-100'
                    }`}>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Periode Perpanjangan</span>
                        <span className="font-semibold text-gray-800">
                          {rentalInfo.extension_billing.period_start && formatDate(rentalInfo.extension_billing.period_start)} - {rentalInfo.extension_billing.period_end && formatDate(rentalInfo.extension_billing.period_end)}
                        </span>
                      </div>
                      {rentalInfo.extension_billing.due_date && (
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-gray-700">Jatuh Tempo</span>
                          <span className="font-semibold text-red-600">{formatDate(rentalInfo.extension_billing.due_date)}</span>
                        </div>
                      )}
                    </div>
                    <p className={`text-sm ${
                      rentalInfo.extension_billing.urgency_level === 'critical'
                        ? 'text-red-500'
                        : rentalInfo.extension_billing.urgency_level === 'warning'
                          ? 'text-amber-500'
                          : 'text-blue-500'
                    }`}>
                      {rentalInfo.extension_billing.urgency_level === 'critical'
                        ? 'Ini adalah kesempatan terakhir untuk memperpanjang sewa Anda!'
                        : rentalInfo.extension_billing.urgency_level === 'warning'
                          ? 'Bayar sekarang untuk memastikan kelanjutan tinggal Anda.'
                          : 'Bayar lebih awal untuk menghindari keterlambatan.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Extension Blocked Alert - No longer used since we allow extension anytime */}
            {!rentalInfo.can_extend && rentalInfo.extension_blocked_reason && (
              <div className="bg-gray-100 border-2 border-gray-300 rounded-2xl p-6 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-7 h-7 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-700 mb-2">Perpanjangan Tidak Tersedia</h3>
                    <p className="text-gray-600">{rentalInfo.extension_blocked_reason}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Masa sewa berakhir: <strong>{formatDate(rentalInfo.current_end_date)}</strong>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Period Selection - Only show if can extend */}
            {rentalInfo.can_extend && (
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Pilih Periode Pembayaran</h2>
                <p className="text-gray-500 mb-6">Bayar lebih lama untuk kenyamanan Anda</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {rentalInfo.payment_options?.map(option => (
                  <button
                    key={option.months}
                    onClick={() => setSelectedMonths(option.months)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      selectedMonths === option.months
                        ? 'border-cyan-500 bg-cyan-50 ring-2 ring-cyan-200'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-lg font-bold ${
                        selectedMonths === option.months ? 'text-cyan-700' : 'text-gray-800'
                      }`}>
                        {option.label}
                      </span>
                      {selectedMonths === option.months && (
                        <span className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                      )}
                    </div>
                    <p className={`text-2xl font-bold ${
                      selectedMonths === option.months ? 'text-cyan-600' : 'text-gray-700'
                    }`}>
                      {formatCurrency(option.total)}
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      {formatCurrency(rentalInfo.monthly_price)}/bulan
                    </p>
                  </button>
                ))}
              </div>

              {/* Payment Summary */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Periode Pembayaran</span>
                  <span className="font-semibold">{selectedMonths} Bulan</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Harga per Bulan</span>
                  <span className="font-semibold">{formatCurrency(rentalInfo.monthly_price)}</span>
                </div>
                <hr className="my-3" />
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-800">Total Pembayaran</span>
                  <span className="text-2xl font-bold text-cyan-600">
                    {formatCurrency(getSelectedOption()?.total || 0)}
                  </span>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm flex items-center justify-between">
                  <span>{error}</span>
                  <button 
                    onClick={() => {
                      setError('');
                      setPaymentStatus('idle');
                      isSnapOpenRef.current = false;
                    }}
                    className="ml-2 text-red-800 hover:text-red-900 font-semibold"
                  >
                    ✕
                  </button>
                </div>
              )}

              {!snapReady && (
                <div className="mb-4 p-3 bg-yellow-100 text-yellow-700 rounded-lg text-sm">
                  ⏳ Memuat sistem pembayaran... Mohon tunggu.
                </div>
              )}

              <button
                onClick={handlePayment}
                disabled={paymentStatus === 'processing' || paymentStatus === 'popup_open' || !snapReady}
                className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-bold text-lg hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {paymentStatus === 'processing' ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Memproses...
                  </span>
                ) : paymentStatus === 'popup_open' ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-pulse h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    Selesaikan di Popup...
                  </span>
                ) : (
                  `Bayar ${formatCurrency(getSelectedOption()?.total || 0)}`
                )}
              </button>
              
              {/* Reset button if stuck */}
              {(paymentStatus === 'popup_open' || paymentStatus === 'processing') && (
                <button
                  onClick={() => {
                    setPaymentStatus('idle');
                    setError('');
                    isSnapOpenRef.current = false;
                  }}
                  className="w-full mt-2 py-2 text-gray-500 hover:text-gray-700 text-sm underline"
                >
                  Batalkan / Reset
                </button>
              )}
              
              <p className="text-center text-gray-400 text-sm mt-4">
                Pembayaran diproses secara aman melalui Midtrans
              </p>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center mb-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">Tidak Ada Penyewaan Aktif</h3>
            <p className="text-gray-500">Anda belum memiliki kamar kos yang disewa.</p>
          </div>
        )}

        {/* Unpaid Invoices / Tagihan Belum Dibayar */}
        {unpaidInvoices.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Tagihan Belum Dibayar</h2>
            <div className="space-y-3">
              {unpaidInvoices.map(invoice => (
                <div key={invoice.id} className={`bg-white rounded-xl shadow p-4 border-l-4 ${
                  invoice.status === 'overdue' ? 'border-red-500' : 'border-orange-500'
                }`}>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-gray-800">Invoice #{invoice.invoice_number}</p>
                        {invoice.status === 'overdue' && (
                          <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                            TELAT BAYAR
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm">{invoice.notes || 'Tagihan Sewa Kos'}</p>
                      <p className="text-gray-500 text-sm">
                        Periode: {formatDate(invoice.billing_period_start)} - {formatDate(invoice.billing_period_end)}
                      </p>
                      {invoice.due_date && (
                        <p className={`text-sm ${invoice.status === 'overdue' ? 'text-red-600 font-semibold' : 'text-gray-400'}`}>
                          Jatuh Tempo: {formatDate(invoice.due_date)}
                        </p>
                      )}
                    </div>
                    <div className="text-right flex flex-col items-end gap-2">
                      <div>
                        <p className="font-bold text-xl text-gray-800">{formatCurrency(invoice.amount)}</p>
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                          invoice.status === 'overdue' 
                            ? 'bg-red-100 text-red-700' 
                            : 'bg-orange-100 text-orange-700'
                        }`}>
                          {invoice.status === 'overdue' ? 'Telat Bayar' : 'Belum Dibayar'}
                        </span>
                      </div>
                      <button
                        onClick={() => downloadInvoice(invoice.id)}
                        className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download Invoice
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
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
    </div>
  );
}
