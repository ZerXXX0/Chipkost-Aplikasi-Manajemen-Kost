import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import Header from "../../components/dashboard/Header"
import { useState, useEffect } from "react"
import dashboardService from "../../services/dashboardService"

const PenyewaDashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [myRoom, setMyRoom] = useState(null)
  const [stats, setStats] = useState({
    roomNumber: '-',
    kosName: '-',
    rentDueDate: '-',
    rentAmount: 0,
    complaints: 0,
    pendingPayments: 0,
  })
  const [loading, setLoading] = useState(true)

  // Fetch stats from backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const [complaints, invoices, room] = await Promise.all([
          dashboardService.getComplaints(),
          dashboardService.getInvoices(),
          dashboardService.getMyRoom(),
        ])
        
        // Get pending payments count
        const pendingCount = invoices?.filter(inv => inv.status === 'pending')?.length || 0
        
        setMyRoom(room)
        setStats({
          roomNumber: room?.room_number || room?.nomor_kamar || '-',
          kosName: room?.kos_name || '-',
          rentDueDate: invoices?.[0]?.due_date || '-',
          rentAmount: room?.price || room?.harga || invoices?.[0]?.amount || 0,
          complaints: complaints?.length || 0,
          pendingPayments: pendingCount,
        })
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

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Selamat Pagi'
    if (hour < 15) return 'Selamat Siang'
    if (hour < 18) return 'Selamat Sore'
    return 'Selamat Malam'
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white flex flex-col">
      <Header />
      <div className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <p className="text-gray-600">Memuat data...</p>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="mb-8 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    {getGreeting()}, {user.first_name}! 👋
                  </h1>
                  <p className="text-gray-500">Kelola sewa dan komplain Anda dengan mudah</p>
                </div>
                <div className="mt-4 md:mt-0">
                  <div className="inline-flex items-center px-4 py-2 bg-green-100 border border-green-300 rounded-full">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                    <span className="text-green-700 text-sm font-medium">Akun Aktif</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {/* Room Info - Featured Card */}
              <div className="lg:col-span-3 rounded-xl shadow-lg p-8 text-white" style={{ backgroundImage: 'linear-gradient(to right, #00A5E8, #0088c7)' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold mb-2 opacity-90">Kamar Anda</h2>
                    <p className="text-6xl font-bold">{stats.roomNumber}</p>
                    <p className="text-sm mt-2 opacity-75">
                      {stats.kosName !== '-' ? `📍 ${stats.kosName}` : 'Belum ada kamar yang ditugaskan'}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="bg-white/20 rounded-lg px-4 py-2 mb-2">
                      <p className="text-sm opacity-75">Status</p>
                      <p className="text-xl font-bold">{myRoom ? 'Aktif' : 'Menunggu'}</p>
                    </div>
                    {myRoom && (
                      <div className="bg-white/10 rounded-lg px-4 py-2">
                        <p className="text-sm opacity-75">Biaya/Bulan</p>
                        <p className="text-lg font-bold">Rp {parseInt(stats.rentAmount).toLocaleString('id-ID')}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Rent Due Date */}
              <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-gray-500 font-medium mb-2">Jatuh Tempo Sewa</h3>
                    <p className="text-2xl font-bold text-blue-600">{stats.rentDueDate}</p>
                    <p className="text-sm text-gray-400 mt-2">Tanggal pembayaran</p>
                  </div>
                  <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center">
                    <span className="text-3xl">📅</span>
                  </div>
                </div>
              </div>

              {/* Rent Amount */}
              <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-gray-500 font-medium mb-2">Biaya Sewa</h3>
                    <p className="text-2xl font-bold text-emerald-600">Rp {parseInt(stats.rentAmount).toLocaleString('id-ID')}</p>
                    <p className="text-sm text-gray-400 mt-2">Per bulan</p>
                  </div>
                  <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center">
                    <span className="text-3xl">💰</span>
                  </div>
                </div>
              </div>
 
              {/* Pending Payments */}
              <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-gray-500 font-medium mb-2">Tagihan Menunggu</h3>
                    <p className="text-4xl font-bold text-red-600">{stats.pendingPayments}</p>
                    <p className="text-sm text-gray-400 mt-2">Pembayaran tertunda</p>
                  </div>
                  <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center">
                    <span className="text-3xl">⏰</span>
                  </div>
                </div>
              </div>

              {/* Complaints */}
              <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-100 md:col-span-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-gray-500 font-medium mb-2">Komplain Anda</h3>
                    <p className="text-4xl font-bold text-orange-600">{stats.complaints}</p>
                    <p className="text-sm text-gray-400 mt-2">Total komplain yang diajukan</p>
                  </div>
                  <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center">
                    <span className="text-3xl">📝</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Aksi Cepat</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button
                  onClick={() => navigate('/penyewa/fitur/payments')}
                  className="group flex flex-col items-center justify-center p-6 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-all duration-300 border border-emerald-200"
                >
                  <span className="text-4xl mb-3 group-hover:scale-110 transition-transform">💳</span>
                  <span className="text-sm font-semibold text-gray-700">Bayar Sewa</span>
                  <span className="text-xs text-gray-500 mt-1">Lihat tagihan</span>
                </button>
                <button
                  onClick={() => navigate('/penyewa/fitur/complaints')}
                  className="group flex flex-col items-center justify-center p-6 bg-purple-50 hover:bg-purple-100 rounded-xl transition-all duration-300 border border-purple-200"
                >
                  <span className="text-4xl mb-3 group-hover:scale-110 transition-transform">📝</span>
                  <span className="text-sm font-semibold text-gray-700">Ajukan Komplain</span>
                  <span className="text-xs text-gray-500 mt-1">Laporkan masalah</span>
                </button>
                <button
                  onClick={() => navigate('/penyewa/fitur')}
                  className="group flex flex-col items-center justify-center p-6 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all duration-300 border border-blue-200"
                >
                  <span className="text-4xl mb-3 group-hover:scale-110 transition-transform">📋</span>
                  <span className="text-sm font-semibold text-gray-700">Semua Fitur</span>
                  <span className="text-xs text-gray-500 mt-1">Lihat semua</span>
                </button>
                <button
                  onClick={() => navigate('/penyewa')}
                  className="group flex flex-col items-center justify-center p-6 bg-orange-50 hover:bg-orange-100 rounded-xl transition-all duration-300 border border-orange-200"
                >
                  <span className="text-4xl mb-3 group-hover:scale-110 transition-transform">📞</span>
                  <span className="text-sm font-semibold text-gray-700">Hubungi Admin</span>
                  <span className="text-xs text-gray-500 mt-1">Bantuan</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PenyewaDashboard
