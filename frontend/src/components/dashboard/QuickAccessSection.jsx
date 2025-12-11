
import { useState } from "react"
import InfoCard from "./InfoCard"
import Pagination from "./Pagination"

const QuickAccessSection = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 3

  const items = [
    {
      id: 1,
      title: "Registrasi Penyewa",
      description: "Lorem ipsum dolor sit amet pretium consectetur adipiscing elit. Lorem consectetur adipiscing elit.",
      imageSrc: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=60",
    },
    {
      id: 2,
      title: "Komplain Penghuni",
      description:
        "Kost Pesbal Mandiri Sejahtera - CiptoXHadiX69: Baru semalam tinggal disini udah hilang aja tabung gas sama motorku emang pompa ni dah gila kali...",
      imageSrc: "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?auto=format&fit=crop&w=800&q=60",
    },
    {
      id: 3,
      title: "Laporan Keuangan",
      description: "Kost Mustika Bujangan - Pemasukan Bulan Januari Rp - 9.000.000 ...",
      imageSrc: "https://images.unsplash.com/photo-1545239705-221baffbfa34?auto=format&fit=crop&w=800&q=60",
    },
    {
      id: 4,
      title: "Tagihan Bulanan",
      description: "Periksa dan kelola invoice serta status pembayaran terbaru.",
      imageSrc: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=60",
    },
    {
      id: 5,
      title: "Verifikasi Pembayaran",
      description: "Konfirmasi bukti pembayaran dari penyewa dan update status.",
      imageSrc: "https://images.unsplash.com/photo-1558640473-9d2a7deb7f62?auto=format&fit=crop&w=800&q=60",
    },
    {
      id: 6,
      title: "Monitoring Kamar",
      description: "Pantau okupansi kamar dan status perbaikan atau perawatan.",
      imageSrc: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=800&q=60",
    },
    {
      id: 7,
      title: "Penjadwalan Perbaikan",
      description: "Kelola jadwal teknisi dan prioritas kerusakan kamar.",
      imageSrc: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=60",
    },
    {
      id: 8,
      title: "Dokumentasi Kerusakan",
      description: "Review foto dan catatan kerusakan yang masuk dari penghuni.",
      imageSrc: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=60",
    },
    {
      id: 9,
      title: "Broadcast Notifikasi",
      description: "Kirim pengumuman penting ke seluruh penyewa (maintenance, event).",
      imageSrc: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=60",
    },
    {
      id: 10,
      title: "Analitik Okupansi",
      description: "Statistik tingkat hunian kos per bulan dengan tren perubahan.",
      imageSrc: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=60",
    },
  ]

  const totalPages = Math.ceil(items.length / itemsPerPage)
  const startIdx = (currentPage - 1) * itemsPerPage
  const endIdx = startIdx + itemsPerPage
  const visibleItems = items.slice(startIdx, endIdx)

  return (
    <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Selamat Datang, User</h1>
        <h2 className="text-2xl font-semibold text-gray-700">Quick Access</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {visibleItems.map((item) => (
          <InfoCard
            key={item.id}
            imageSrc={item.imageSrc}
            title={item.title}
            description={item.description}
            onClick={() => console.log("View", item.id)}
          />
        ))}
      </div>
      <div className="flex justify-center">
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
    </section>
  )
}

export default QuickAccessSection
