import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SubHeader from '../../components/dashboard/SubHeader';
import api from '../../services/api';
import dashboardService from '../../services/dashboardService';
import * as XLSX from 'xlsx';

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
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [showExportModal, setShowExportModal] = useState(false);

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
    
    // Find the room to get rental ID
    const selectedRoom = rooms.find(r => r.id === parseInt(invoiceForm.kamar, 10));
    if (!selectedRoom || !selectedRoom.rental_id) {
      setError('Kamar tidak memiliki data penyewaan aktif');
      return;
    }
    
    // Generate invoice number
    const invoiceNumber = `INV-${Date.now()}`;
    
    try {
      const response = await api.post('/invoice/', {
        rental: selectedRoom.rental_id,
        penyewa: selectedRoom.penyewa,
        invoice_number: invoiceNumber,
        amount: parseFloat(invoiceForm.amount),
        tenggat: invoiceForm.due_date,
        notes: invoiceForm.description || 'Tagihan Sewa Bulanan',
        status: 'unpaid',
      });
      setInvoices([...invoices, response.data]);
      setShowCreateModal(false);
      setInvoiceForm({ kamar: '', amount: '', description: '', due_date: '' });
      setError('');
    } catch (err) {
      console.error('Error creating invoice:', err);
      console.error('Error details:', err.response?.data);
      
      // Extract error message
      let errorMessage = 'Gagal membuat tagihan';
      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        } else if (err.response.data.detail) {
          errorMessage = err.response.data.detail;
        } else if (err.response.data.error) {
          errorMessage = err.response.data.error;
        } else {
          // Try to get first error message from field errors
          const firstError = Object.values(err.response.data)[0];
          if (Array.isArray(firstError)) {
            errorMessage = firstError[0];
          } else if (typeof firstError === 'string') {
            errorMessage = firstError;
          }
        }
      }
      setError(errorMessage);
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

  // Filter invoices by date range
  const getFilteredInvoices = () => {
    // If no date range selected, show all
    if (!dateRange.startDate && !dateRange.endDate) return invoices;
    
    const filtered = invoices.filter(inv => {
      // Try to get a valid date from multiple possible fields
      let dateStr = inv.created_at || inv.due_date || inv.tgl_dibuat;
      if (!dateStr) return false; // Skip if no date available
      
      const invoiceDate = new Date(dateStr);
      
      // Check if date is valid
      if (isNaN(invoiceDate.getTime())) return false;
      
      // Reset time to compare only dates
      invoiceDate.setHours(0, 0, 0, 0);
      
      // Apply start date filter
      if (dateRange.startDate) {
        const startDate = new Date(dateRange.startDate);
        startDate.setHours(0, 0, 0, 0);
        if (invoiceDate < startDate) return false;
      }
      
      // Apply end date filter
      if (dateRange.endDate) {
        const endDate = new Date(dateRange.endDate);
        endDate.setHours(23, 59, 59, 999);
        if (invoiceDate > endDate) return false;
      }
      
      return true;
    });
    
    return filtered;
  };

  const filteredInvoices = getFilteredInvoices();

  // Calculate statistics based on filtered invoices
  const totalIncome = filteredInvoices
    .filter(inv => inv.status === 'paid' || inv.status === 'lunas')
    .reduce((sum, inv) => sum + parseFloat(inv.amount || inv.total || 0), 0);
  
  const pendingAmount = filteredInvoices
    .filter(inv => inv.status === 'pending' || inv.status === 'belum_lunas')
    .reduce((sum, inv) => sum + parseFloat(inv.amount || inv.total || 0), 0);

  const paidCount = filteredInvoices.filter(inv => inv.status === 'paid' || inv.status === 'lunas').length;
  const pendingCount = filteredInvoices.filter(inv => inv.status === 'pending' || inv.status === 'belum_lunas').length;

  // Export to Excel function
  const exportToExcel = () => {
    // Prepare data with detailed information
    const exportData = filteredInvoices.map((invoice, index) => {
      const room = rooms.find(r => r.id === invoice.kamar);
      return {
        'No': index + 1,
        'Tanggal': invoice.created_at ? new Date(invoice.created_at).toLocaleDateString('id-ID') : '-',
        'No. Invoice': invoice.invoice_number || invoice.id || '-',
        'Kos': invoice.kamar_detail?.kos_name || room?.kos_name || room?.kos?.name || '-',
        'No. Kamar': invoice.kamar_detail?.room_number || room?.room_number || room?.nomor_kamar || invoice.kamar,
        'Penyewa': invoice.penyewa_username || room?.penyewa_username || '-',
        'Nama Lengkap': invoice.penyewa_name || room?.penyewa_name || '-',
        'Deskripsi': invoice.description || invoice.notes || 'Tagihan Sewa Bulanan',
        'Jumlah (Rp)': parseFloat(invoice.amount || invoice.total || 0),
        'Jatuh Tempo': invoice.due_date || invoice.tenggat || '-',
        'Status Pembayaran': invoice.status === 'paid' || invoice.status === 'lunas' ? 'Lunas' : 'Belum Lunas',
        'Tanggal Bayar': invoice.paid_at ? new Date(invoice.paid_at).toLocaleDateString('id-ID') : '-'
      };
    });

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(exportData);
    
    // Set column widths
    ws['!cols'] = [
      { wch: 5 },  // No
      { wch: 12 }, // Tanggal
      { wch: 12 }, // No. Invoice
      { wch: 20 }, // Kos
      { wch: 10 }, // No. Kamar
      { wch: 15 }, // Penyewa
      { wch: 20 }, // Nama Lengkap
      { wch: 30 }, // Deskripsi
      { wch: 15 }, // Jumlah
      { wch: 12 }, // Jatuh Tempo
      { wch: 15 }, // Status
      { wch: 12 }  // Tanggal Bayar
    ];

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Laporan Keuangan');

    // Add summary sheet
    const getPeriodText = () => {
      if (!dateRange.startDate && !dateRange.endDate) return 'Semua Periode';
      if (dateRange.startDate && dateRange.endDate) {
        return `${new Date(dateRange.startDate).toLocaleDateString('id-ID')} - ${new Date(dateRange.endDate).toLocaleDateString('id-ID')}`;
      }
      if (dateRange.startDate) return `Dari ${new Date(dateRange.startDate).toLocaleDateString('id-ID')}`;
      if (dateRange.endDate) return `Sampai ${new Date(dateRange.endDate).toLocaleDateString('id-ID')}`;
      return 'Semua Periode';
    };

    const summaryData = [
      { 'Keterangan': 'Total Pendapatan (Lunas)', 'Nilai': `Rp ${totalIncome.toLocaleString('id-ID')}` },
      { 'Keterangan': 'Total Tertunda', 'Nilai': `Rp ${pendingAmount.toLocaleString('id-ID')}` },
      { 'Keterangan': 'Jumlah Invoice Lunas', 'Nilai': paidCount },
      { 'Keterangan': 'Jumlah Invoice Belum Lunas', 'Nilai': pendingCount },
      { 'Keterangan': 'Total Invoice', 'Nilai': filteredInvoices.length },
      { 'Keterangan': 'Periode', 'Nilai': getPeriodText() },
      { 'Keterangan': 'Tanggal Export', 'Nilai': new Date().toLocaleString('id-ID') }
    ];
    
    const wsSummary = XLSX.utils.json_to_sheet(summaryData);
    wsSummary['!cols'] = [{ wch: 30 }, { wch: 30 }];
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Ringkasan');

    // Generate filename
    let fileNamePeriod = 'Semua';
    if (dateRange.startDate && dateRange.endDate) {
      fileNamePeriod = `${dateRange.startDate}_sampai_${dateRange.endDate}`;
    } else if (dateRange.startDate) {
      fileNamePeriod = `Dari_${dateRange.startDate}`;
    } else if (dateRange.endDate) {
      fileNamePeriod = `Sampai_${dateRange.endDate}`;
    }
    const fileName = `Laporan_Keuangan_${fileNamePeriod}_${new Date().toISOString().split('T')[0]}.xlsx`;

    // Save file
    XLSX.writeFile(wb, fileName);
    setShowExportModal(false);
  };

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
      <SubHeader title="Laporan Keuangan" backPath="/admin/fitur" />

      {/* Additional Action Buttons */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Date Range Filter */}
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700">Periode:</label>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white text-sm"
              placeholder="Tanggal Mulai"
            />
            <span className="text-gray-500">—</span>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white text-sm"
              placeholder="Tanggal Akhir"
            />
            {(dateRange.startDate || dateRange.endDate) && (
              <button
                onClick={() => setDateRange({ startDate: '', endDate: '' })}
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowExportModal(true)}
            className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
          >
            Export Excel
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-cyan-500 text-white font-semibold rounded-lg hover:bg-cyan-600 transition-colors"
          >
            + Buat Tagihan
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="text-emerald-100 text-sm font-medium">Total Pendapatan</p>
            </div>
            <p className="text-3xl font-bold">Rp {totalIncome.toLocaleString('id-ID')}</p>
            <p className="text-emerald-200 text-sm mt-2">Dari {paidCount} pembayaran</p>
          </div>
          
          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="text-yellow-100 text-sm font-medium">Menunggu Pembayaran</p>
            </div>
            <p className="text-3xl font-bold">Rp {pendingAmount.toLocaleString('id-ID')}</p>
            <p className="text-yellow-200 text-sm mt-2">{pendingCount} tagihan tertunda</p>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="text-blue-100 text-sm font-medium">Total Tagihan</p>
            </div>
            <p className="text-3xl font-bold">{filteredInvoices.length}</p>
            <p className="text-blue-200 text-sm mt-2">Periode dipilih</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="text-purple-100 text-sm font-medium">Tingkat Pembayaran</p>
            </div>
            <p className="text-3xl font-bold">
              {filteredInvoices.length > 0 ? Math.round((paidCount / filteredInvoices.length) * 100) : 0}%
            </p>
            <p className="text-purple-200 text-sm mt-2">Lunas tepat waktu</p>
          </div>
        </div>

        {/* Invoices Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Daftar Tagihan</h2>
              <p className="text-sm text-gray-500 mt-1">
                Menampilkan {filteredInvoices.length} dari {invoices.length} tagihan
              </p>
            </div>
          </div>
          
          {filteredInvoices.length === 0 ? (
            <div className="p-12 text-center">
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
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Kos</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Kamar</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Penyewa</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Deskripsi</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Jumlah</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Jatuh Tempo</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredInvoices.map(invoice => {
                    const room = rooms.find(r => r.id === invoice.kamar);
                    return (
                    <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-700">
                          {invoice.kamar_detail?.kos_name || room?.kos_name || room?.kos?.name || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-800">
                          Kamar {invoice.kamar_detail?.room_number || invoice.kamar_detail?.nomor_kamar || room?.room_number || room?.nomor_kamar || invoice.kamar}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-800">
                            {invoice.penyewa_name || room?.penyewa_name || '-'}
                          </span>
                          <span className="text-xs text-gray-500">
                            @{invoice.penyewa_username || room?.penyewa_username || '-'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">
                        {invoice.description || 'Tagihan Sewa Bulanan'}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-gray-800">
                          Rp {parseFloat(invoice.amount || invoice.total || 0).toLocaleString('id-ID')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">
                        {invoice.due_date || '-'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                          invoice.status === 'paid' || invoice.status === 'lunas'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {invoice.status === 'paid' || invoice.status === 'lunas' ? 'Lunas' : 'Belum Lunas'}
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
                  );
                  })}
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
                  {rooms.filter(r => r.penyewa && r.rental_id).map(room => (
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

      {/* Export Excel Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <h2 className="text-2xl font-bold mb-4">Export Laporan Keuangan</h2>
            <p className="text-gray-600 mb-6">
              Export laporan keuangan ke file Excel dengan detail lengkap
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm font-medium text-blue-800 mb-2">Yang akan di-export:</p>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Periode: <strong>
                  {!dateRange.startDate && !dateRange.endDate ? 'Semua Periode' :
                   dateRange.startDate && dateRange.endDate ? `${new Date(dateRange.startDate).toLocaleDateString('id-ID')} - ${new Date(dateRange.endDate).toLocaleDateString('id-ID')}` :
                   dateRange.startDate ? `Dari ${new Date(dateRange.startDate).toLocaleDateString('id-ID')}` :
                   `Sampai ${new Date(dateRange.endDate).toLocaleDateString('id-ID')}`}
                </strong></li>
                <li>• Total Invoice: <strong>{filteredInvoices.length}</strong></li>
                <li>• Invoice Lunas: <strong>{filteredInvoices.filter(inv => inv.status === 'paid' || inv.status === 'lunas').length}</strong></li>
                <li>• Invoice Belum Lunas: <strong>{filteredInvoices.filter(inv => inv.status === 'pending' || inv.status === 'belum_lunas').length}</strong></li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm font-medium text-gray-700 mb-2">File akan berisi:</p>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>Nama Kos dan Nomor Kamar</li>
                <li>Data Penyewa (Username & Nama Lengkap)</li>
                <li>Detail Tagihan & Jumlah</li>
                <li>Tanggal Jatuh Tempo & Status Pembayaran</li>
                <li>Sheet Ringkasan Total Pendapatan</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={exportToExcel}
                className="flex-1 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold transition-colors"
              >
                Download Excel
              </button>
              <button
                type="button"
                onClick={() => setShowExportModal(false)}
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
