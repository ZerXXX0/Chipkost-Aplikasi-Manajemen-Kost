"use client"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import Header from "../../components/dashboard/Header"
import { useState, useEffect } from "react"
import dashboardService from "../../services/dashboardService"

const DashboardPage = () => {
  const { logout, user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRooms: 0,
    occupiedRooms: 0,
    availableRooms: 0,
    maintenanceRooms: 0,
    totalInvoices: 0,
    pendingInvoices: 0,
    paidInvoices: 0,
    totalComplaints: 0,
    pendingComplaints: 0,
    resolvedComplaints: 0,
    monthlyIncome: 0,
    rentals: 0,
  })
  const [recentComplaints, setRecentComplaints] = useState([])
  const [recentPayments, setRecentPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Fetch stats from backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        if (user?.role === 'admin') {
          const [users, rooms, complaints, invoices, rentals] = await Promise.all([
            dashboardService.getUsers(),
            dashboardService.getRooms(),
            dashboardService.getComplaints(),
            dashboardService.getInvoices(),
            dashboardService.getRentals(),
          ])
          
          const roomsList = rooms || []
          const complaintsList = complaints || []
          const invoicesList = invoices || []
          
          const occupiedCount = roomsList.filter(r => r.status === 'occupied').length
          const availableCount = roomsList.filter(r => r.status === 'available').length
          const maintenanceCount = roomsList.filter(r => r.status === 'maintenance').length
          
          // Invoice status: unpaid, paid, overdue, cancelled
          const pendingInvoices = invoicesList.filter(i => i.status === 'unpaid' || i.status === 'overdue').length
          const paidInvoices = invoicesList.filter(i => i.status === 'paid').length
          
          const pendingComplaints = complaintsList.filter(c => c.status === 'pending' || c.status === 'dilaporkan').length
          const resolvedComplaints = complaintsList.filter(c => c.status === 'resolved' || c.status === 'selesai').length
          
          const totalIncome = invoicesList
            .filter(i => i.status === 'paid')
            .reduce((sum, inv) => sum + parseFloat(inv.amount || inv.total || 0), 0)
          
          setStats({
            totalUsers: users?.length || 0,
            totalRooms: roomsList.length,
            occupiedRooms: occupiedCount,
            availableRooms: availableCount,
            maintenanceRooms: maintenanceCount,
            totalInvoices: invoicesList.length,
            pendingInvoices,
            paidInvoices,
            totalComplaints: complaintsList.length,
            pendingComplaints,
            resolvedComplaints,
            monthlyIncome: totalIncome,
            rentals: rentals?.length || 0,
          })
          
          // Set recent data
          setRecentComplaints(complaintsList.slice(0, 5))
          setRecentPayments(invoicesList.slice(0, 5))
        } else {
          const [complaints, invoices] = await Promise.all([
            dashboardService.getComplaints(),
            dashboardService.getInvoices(),
          ])
          
          const complaintsList = complaints || []
          const invoicesList = invoices || []
          
          setStats({
            totalUsers: 0,
            totalRooms: 0,
            occupiedRooms: 0,
            availableRooms: 0,
            maintenanceRooms: 0,
            totalInvoices: invoicesList.length,
            pendingInvoices: invoicesList.filter(i => i.status === 'pending' || i.status === 'belum_lunas').length,
            paidInvoices: invoicesList.filter(i => i.status === 'paid' || i.status === 'lunas').length,
            totalComplaints: complaintsList.length,
            pendingComplaints: complaintsList.filter(c => c.status === 'pending' || c.status === 'dilaporkan').length,
            resolvedComplaints: complaintsList.filter(c => c.status === 'resolved' || c.status === 'selesai').length,
            monthlyIncome: 0,
            rentals: 0,
          })
          
          setRecentComplaints(complaintsList.slice(0, 3))
          setRecentPayments(invoicesList.slice(0, 3))
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchStats()
    }
  }, [user])

  const formatCurrency = (amount) => {
    if (amount >= 1000000) {
      return `Rp ${(amount / 1000000).toFixed(1)}jt`
    }
    return `Rp ${amount.toLocaleString('id-ID')}`
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return 'Selamat Pagi'
    if (hour < 15) return 'Selamat Siang'
    if (hour < 18) return 'Selamat Sore'
    return 'Selamat Malam'
  }

  const occupancyRate = stats.totalRooms > 0 
    ? Math.round((stats.occupiedRooms / stats.totalRooms) * 100) 
    : 0

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg">Memuat dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white">
      <Header />
      
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Welcome Header */}
          <div className="mb-8 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    {getGreeting()}, {user?.first_name || user?.username}!
                </h1>
                <p className="text-gray-500">
                  {formatDate(currentTime)} • {formatTime(currentTime)}
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <div className="inline-flex items-center px-4 py-2 bg-green-100 border border-green-300 rounded-full">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                  <span className="text-green-700 text-sm font-medium">Sistem Online</span>
                </div>
              </div>
            </div>
          </div>

          {user?.role === 'admin' ? (
            <>
              {/* Main Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                
                {/* Occupancy Rate Card */}
                <div className="lg:col-span-2 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-6 text-white shadow-xl shadow-blue-500/20">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-blue-100 text-sm font-medium">Tingkat Hunian</p>
                      <p className="text-5xl font-bold mt-2">{occupancyRate}%</p>
                    </div>
                    <div className="w-24 h-24 relative">
                      <svg className="w-24 h-24 transform -rotate-90">
                        <circle cx="48" cy="48" r="40" stroke="rgba(255,255,255,0.2)" strokeWidth="8" fill="none"/>
                        <circle 
                          cx="48" cy="48" r="40" 
                          stroke="white" 
                          strokeWidth="8" 
                          fill="none"
                          strokeDasharray={`${occupancyRate * 2.51} 251`}
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/20">
                    <div>
                      <p className="text-blue-100 text-xs">Total</p>
                      <p className="text-xl font-bold">{stats.totalRooms}</p>
                    </div>
                    <div>
                      <p className="text-blue-100 text-xs">Terisi</p>
                      <p className="text-xl font-bold">{stats.occupiedRooms}</p>
                    </div>
                    <div>
                      <p className="text-blue-100 text-xs">Kosong</p>
                      <p className="text-xl font-bold">{stats.availableRooms}</p>
                    </div>
                  </div>
                </div>

                {/* Monthly Income */}
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl p-6 text-white shadow-xl shadow-emerald-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-emerald-100 text-sm font-medium">Pendapatan</p>
                  </div>
                  <p className="text-3xl font-bold">{formatCurrency(stats.monthlyIncome)}</p>
                  <p className="text-emerald-200 text-sm mt-2">Total pemasukan</p>
                </div>

                {/* Total                 
                Sekarang saya buat dokumentasi lengkap dalam format Mermaid (bisa di-render di GitHub/GitLab):
                
                ```mermaid
                sequenceDiagram
                    participant Penyewa as Penyewa (User)
                    participant FE as PaymentsPage<br/>(Frontend)
                    participant API as API Gateway<br/>(Django)
                    participant Backend as Billing Service<br/>(Django)
                    participant Midtrans as Midtrans<br/>(Payment Gateway)
                    participant DB as Database
                
                    Penyewa->>FE: 1. Membuka halaman pembayaran
                    FE->>API: 2. GET /api/rental-info/
                    API->>Backend: Fetch rental & invoices
                    Backend->>DB: Query Rental, Invoice, Room
                    DB-->>Backend: Return data
                    Backend-->>API: Return rental info
                    API-->>FE: Rental data (room, price, invoices)
                    FE->>Penyewa: 3. Display payment options & pending invoices
                
                    Penyewa->>FE: 4. Pilih periode (1/6/12 bulan) & klik "Bayar"
                    FE->>API: 5. POST /api/pembayaran/create-snap-transaction/
                    Note over API: {invoice_id, months_selected, payment_method}
                    
                    API->>Backend: Process create transaction request
                    Backend->>DB: Create Pembayaran record<br/>(status: pending)
                    DB-->>Backend: Return pembayaran_id
                    
                    Backend->>Midtrans: 6. Call Snap API<br/>(create_transaction)
                    Note over Midtrans: Transaction details:<br/>- Order ID<br/>- Amount<br/>- Item details
                    
                    Midtrans-->>Backend: Return snap_token & order_id
                    
                    Backend->>DB: Update Pembayaran<br/>(transaction_id, snap_token)
                    DB-->>Backend: Success
                    
                    Backend-->>API: {snap_token, transaction_id}
                    API-->>FE: snap_token response
                    FE->>Penyewa: 7. Display Midtrans Snap popup
                
                    Penyewa->>Midtrans: 8. Pilih metode pembayaran<br/>(Kartu Kredit/VA/QRIS/etc)
                    Penyewa->>Midtrans: 9. Isi detail pembayaran
                    Midtrans->>Midtrans: 10. Proses pembayaran
                    
                    alt Pembayaran Berhasil
                        Midtrans->>Backend: 11. Webhook notification<br/>(transaction settlement)
                        Note over Backend: POST /api/pembayaran/midtrans-notification/
                        
                        Backend->>Midtrans: 12. Verify notification signature
                        Midtrans-->>Backend: Signature valid
                        
                        Backend->>DB: 13. Update Pembayaran<br/>(status: completed)
                        DB-->>Backend: Success
                        
                        Backend->>DB: 14. Update Invoice<br/>(status: paid)
                        DB-->>Backend: Success
                        
                        Backend->>Backend: 15. Calculate new rental end_date<br/>(current_end + months)
                        
                        Backend->>DB: 16. Update Rental<br/>(end_date: calculated)
                        DB-->>Backend: Success
                        
                        Backend->>DB: 17. Create Notifikasi<br/>(success message)
                        DB-->>Backend: Success
                        
                        Backend-->>Midtrans: 200 OK (webhook processed)
                        Midtrans-->>FE: Payment success redirect
                        
                    else Pembayaran Gagal
                        Midtrans-->>FE: Payment failed
                        FE->>Penyewa: Display error message
                    end
                    
                    FE->>Penyewa: 18. Show success/failure notification
                    
                    opt Manual Status Check
                        FE->>API: 19. GET /api/pembayaran/check-transaction/{id}
                        API->>Backend: Fetch pembayaran status
                        Backend->>Midtrans: Get transaction status (CoreAPI)
                        Midtrans-->>Backend: Transaction status
                        
                        alt Status = Settlement
                            Backend->>DB: Update Pembayaran & Invoice if needed
                            DB-->>Backend: Success
                        end
                        
                        Backend-->>API: Updated pembayaran data
                        API-->>FE: Current status
                        FE->>Penyewa: Update UI with current status
                    end
                    
                    FE->>API: 20. GET /api/pembayaran/pending/
                    API->>Backend: Fetch all pending payments
                    Backend->>DB: Query Pembayaran where status=pending
                    DB-->>Backend: Return list
                    Backend-->>API: Pembayaran list
                    API-->>FE: Updated list
                    FE->>Penyewa: 21. Refresh dashboard dengan status terbaruUsers */}
                <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl p-6 text-white shadow-xl shadow-purple-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-purple-100 text-sm font-medium">Pengguna</p>
                  </div>
                  <p className="text-3xl font-bold">{stats.totalUsers}</p>
                  <p className="text-purple-200 text-sm mt-2">User terdaftar</p>
                </div>
              </div>

              {/* Secondary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                
                {/* Complaints Card */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-800 font-semibold">Komplain</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-black-500 text-sm">Total</span>
                      <span className="text-black-800 font-bold text-xl">{stats.totalComplaints}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-black-600 text-sm">Menunggu</span>
                      <span className="text-black-600 font-semibold">{stats.pendingComplaints}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-black-600 text-sm">Selesai</span>
                      <span className="text-black-600 font-semibold">{stats.resolvedComplaints}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => navigate('/admin/fitur/complaints')}
                    className="w-full mt-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                  >
                    Lihat Semua →
                  </button>
                </div>

                {/* Invoices Card */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-800 font-semibold">Tagihan</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-black-500 text-sm">Total</span>
                      <span className="text-black-800 font-bold text-xl">{stats.totalInvoices}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-black-600 text-sm">Belum Lunas</span>
                      <span className="text-black-600 font-semibold">{stats.pendingInvoices}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-black-600 text-sm">Lunas</span>
                      <span className="text-black-600 font-semibold">{stats.paidInvoices}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => navigate('/admin/fitur/financial')}
                    className="w-full mt-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                  >
                    Lihat Semua →
                  </button>
                </div>

                {/* Room Status */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-800 font-semibold">Status Kamar</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-black-600 text-sm">Tersedia</span>
                      <span className="text-black-600 font-semibold">{stats.availableRooms}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-black-600 text-sm">Terisi</span>
                      <span className="text-black-600 font-semibold">{stats.occupiedRooms}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-black-600 text-sm">Perbaikan</span>
                      <span className="text-black-600 font-semibold">{stats.maintenanceRooms}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => navigate('/admin/fitur/rooms')}
                    className="w-full mt-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                  >
                    Kelola Kamar →
                  </button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Quick Access</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button
                    onClick={() => navigate('/admin/fitur/register')}
                    className="group flex flex-col items-center justify-center p-6 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all duration-300 border border-blue-200"
                  >
                    <span className="text-sm font-semibold text-gray-700">Registrasi User</span>
                  </button>
                  <button
                    onClick={() => navigate('/admin/fitur/rooms')}
                    className="group flex flex-col items-center justify-center p-6 bg-green-50 hover:bg-green-100 rounded-xl transition-all duration-300 border border-green-200"
                  >
                    <span className="text-sm font-semibold text-gray-700">Kelola Kamar</span>
                  </button>
                  <button
                    onClick={() => navigate('/admin/fitur/complaints')}
                    className="group flex flex-col items-center justify-center p-6 bg-purple-50 hover:bg-purple-100 rounded-xl transition-all duration-300 border border-purple-200"
                  >
                    <span className="text-sm font-semibold text-gray-700">Lihat Komplain</span>
                  </button>
                  <button
                    onClick={() => navigate('/admin/fitur/financial')}
                    className="group flex flex-col items-center justify-center p-6 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-all duration-300 border border-emerald-200"
                  >
                    <span className="text-sm font-semibold text-gray-700">Laporan Keuangan</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* Penyewa Dashboard */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-800 font-semibold">Komplain Saya</h3>
                  
                </div>
                <p className="text-4xl font-bold text-gray-800 mb-2">{stats.totalComplaints}</p>
                <p className="text-gray-500 text-sm">{stats.pendingComplaints} menunggu respon</p>
                <button 
                  onClick={() => navigate('/penyewa/fitur/complaints')}
                  className="w-full mt-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Ajukan Komplain
                </button>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-800 font-semibold">Tagihan Saya</h3>
                </div>
                <p className="text-4xl font-bold text-black-800 mb-2">{stats.pendingInvoices}</p>
                <p className="text-black-500 text-sm">tagihan belum lunas</p>
                <button 
                  onClick={() => navigate('/penyewa/fitur/payments')}
                  className="w-full mt-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Lihat Tagihan
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
