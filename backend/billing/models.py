from django.db import models
from django.contrib.auth import get_user_model
from rooms.models import Rental, Room

User = get_user_model()

class Invoice(models.Model):
    STATUS_CHOICES = (
        ('unpaid', 'Belum Dibayar'),
        ('paid', 'Lunas'),
        ('overdue', 'Telat Bayar'),
        ('cancelled', 'Batal Membayar'),
    )
    
    rental = models.ForeignKey(Rental, on_delete=models.CASCADE, related_name='invoices', verbose_name='Penyewaan')
    penyewa = models.ForeignKey(User, on_delete=models.CASCADE, related_name='invoices', null=True, blank=True, verbose_name='Penyewa')
    invoice_number = models.CharField(max_length=50, unique=True, verbose_name='Nomor Invoice')
    amount = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Jumlah')
    invoice_start_date = models.DateField(verbose_name='Awal Periode Tagihan', null=True, blank=True)
    invoice_end_date = models.DateField(verbose_name='Akhir Periode Tagihan', null=True, blank=True)
    tenggat = models.DateField(verbose_name='Tanggal Jatuh Tempo', null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='unpaid', verbose_name='Status')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Dibuat pada')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Diperbarui pada')
    
    class Meta:
        db_table = 'invoices'
        verbose_name = 'Invoice'
        verbose_name_plural = 'Invoice'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Invoice {self.invoice_number} - {self.penyewa.username}"

class Pembayaran(models.Model):
    """Payment table (Tabel PEMBAYARAN)"""
    STATUS_CHOICES = (
        ('pending', 'Tertunda'),
        ('completed', 'Selesai'),
        ('failed', 'Gagal'),
        ('cancelled', 'Dibatalkan'),
    )
    
    METODE_CHOICES = (
        ('cash', 'Tunai'),
        ('bank_transfer', 'Transfer Bank'),
        ('qris', 'QRIS'),
        ('e_wallet', 'Dompet Digital'),
    )
    
    pembayaran_id = models.AutoField(primary_key=True)
    penyewa = models.ForeignKey(User, on_delete=models.CASCADE, related_name='pembayaran', limit_choices_to={'role': 'penyewa'}, verbose_name='Penyewa')
    kamar = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='pembayaran', verbose_name='Kamar')
    tgl_bayar = models.DateTimeField(auto_now_add=True, verbose_name='Tanggal Bayar')
    jumlah = models.DecimalField(max_digits=12, decimal_places=2, verbose_name='Jumlah')
    tenggat = models.DateField(null=True, blank=True, verbose_name='Tanggal Jatuh Tempo')
    metode = models.CharField(max_length=20, choices=METODE_CHOICES, verbose_name='Metode Pembayaran')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', verbose_name='Status')
    transaction_id = models.CharField(max_length=100, blank=True, null=True, verbose_name='ID Transaksi')
    payment_proof = models.ImageField(upload_to='payment_proofs/', blank=True, null=True, verbose_name='Bukti Pembayaran')
    notes = models.TextField(blank=True, null=True, verbose_name='Catatan')
    verified_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='verified_pembayaran', limit_choices_to={'role': 'admin'}, verbose_name='Diverifikasi oleh')
    verified_at = models.DateTimeField(null=True, blank=True, verbose_name='Diverifikasi pada')
    
    class Meta:
        db_table = 'pembayaran'
        verbose_name = 'Pembayaran'
        verbose_name_plural = 'Pembayaran'
        ordering = ['-tgl_bayar']
    
    def __str__(self):
        return f"Pembayaran {self.jumlah} - {self.penyewa.username} ({self.get_status_display()})"

class LaporanKeuangan(models.Model):
    """Financial Report table (Tabel LAPORAN_KEUANGAN)"""
    BULAN_CHOICES = (
        ('Januari', 'Januari'),
        ('Februari', 'Februari'),
        ('Maret', 'Maret'),
        ('April', 'April'),
        ('Mei', 'Mei'),
        ('Juni', 'Juni'),
        ('Juli', 'Juli'),
        ('Agustus', 'Agustus'),
        ('September', 'September'),
        ('Oktober', 'Oktober'),
        ('November', 'November'),
        ('Desember', 'Desember'),
    )
    
    laporan_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='laporan_keuangan', limit_choices_to={'role': 'admin'}, verbose_name='Admin Pembuat', null=True, blank=True)
    bulan = models.CharField(max_length=20, choices=BULAN_CHOICES, verbose_name='Bulan')
    tahun = models.IntegerField(verbose_name='Tahun', default=2025)
    total_pemasukan = models.DecimalField(max_digits=15, decimal_places=2, default=0, verbose_name='Total Pemasukan')
    total_pengeluaran = models.DecimalField(max_digits=15, decimal_places=2, default=0, verbose_name='Total Pengeluaran')
    saldo = models.DecimalField(max_digits=15, decimal_places=2, default=0, verbose_name='Saldo')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Dibuat pada')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Diperbarui pada')
    
    class Meta:
        db_table = 'laporan_keuangan'
        verbose_name = 'Laporan Keuangan'
        verbose_name_plural = 'Laporan Keuangan'
        ordering = ['-tahun', '-bulan']
        unique_together = ['bulan', 'tahun']
    
    def __str__(self):
        return f"Laporan Keuangan - {self.bulan} {self.tahun}"
    
    def save(self, *args, **kwargs):
        # Calculate saldo automatically
        self.saldo = self.total_pemasukan - self.total_pengeluaran
        super().save(*args, **kwargs)
    
    @classmethod
    def generateLaporan(cls, user, bulan, tahun):
        """
        Generate financial report for a specific month and year
        Calculate total income (pemasukan) from completed payments
        and total expenses (pengeluaran) from various sources
        """
        from datetime import datetime
        from django.db.models import Sum, Q
        
        # Map month name to number
        bulan_map = {
            'Januari': 1, 'Februari': 2, 'Maret': 3, 'April': 4,
            'Mei': 5, 'Juni': 6, 'Juli': 7, 'Agustus': 8,
            'September': 9, 'Oktober': 10, 'November': 11, 'Desember': 12
        }
        bulan_num = bulan_map.get(bulan)
        
        if not bulan_num:
            raise ValueError(f"Invalid month: {bulan}")
        
        # Calculate total income from completed payments in this month
        total_pemasukan = Pembayaran.objects.filter(
            tgl_bayar__month=bulan_num,
            tgl_bayar__year=tahun,
            status='completed'
        ).aggregate(total=Sum('jumlah'))['total'] or 0
        
        # Calculate total expenses (you can add more expense sources here)
        # For now, we'll set it to 0 or you can add expense tracking
        total_pengeluaran = 0
        
        # Calculate saldo
        saldo = total_pemasukan - total_pengeluaran
        
        # Create or update report
        laporan, created = cls.objects.update_or_create(
            bulan=bulan,
            tahun=tahun,
            defaults={
                'user': user,
                'total_pemasukan': total_pemasukan,
                'total_pengeluaran': total_pengeluaran,
                'saldo': saldo,
            }
        )
        
        return laporan
