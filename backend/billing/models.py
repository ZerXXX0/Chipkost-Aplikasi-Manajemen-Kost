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
    penyewa = models.ForeignKey(User, on_delete=models.SET_NULL, related_name='invoices', null=True, blank=True, verbose_name='Penyewa')
    invoice_number = models.CharField(max_length=50, unique=True, verbose_name='Nomor Invoice')
    amount = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Jumlah')
    invoice_start_date = models.DateField(verbose_name='Awal Periode Tagihan', null=True, blank=True, db_column='billing_period_start')
    invoice_end_date = models.DateField(verbose_name='Akhir Periode Tagihan', null=True, blank=True, db_column='billing_period_end')
    tenggat = models.DateField(verbose_name='Tanggal Jatuh Tempo', null=True, blank=True, db_column='due_date')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='unpaid', verbose_name='Status')
    notes = models.TextField(blank=True, null=True, verbose_name='Catatan')
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
        ('midtrans', 'Midtrans'),
    )
    
    pembayaran_id = models.AutoField(primary_key=True)
    penyewa = models.ForeignKey(User, on_delete=models.SET_NULL, related_name='pembayaran', limit_choices_to={'role': 'penyewa'}, verbose_name='Penyewa', null=True, blank=True)
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
    
    laporan_id = models.AutoField(primary_key=True)
    bulan = models.DateField(verbose_name='Bulan')
    total_pemasukan = models.DecimalField(max_digits=15, decimal_places=2, default=0, verbose_name='Total Pemasukan')
    total_pengeluaran = models.DecimalField(max_digits=15, decimal_places=2, default=0, verbose_name='Total Pengeluaran')
    saldo = models.DecimalField(max_digits=15, decimal_places=2, default=0, verbose_name='Saldo')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Dibuat pada')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Diperbarui pada')
    
    class Meta:
        db_table = 'laporan_keuangan'
        verbose_name = 'Laporan Keuangan'
        verbose_name_plural = 'Laporan Keuangan'
        ordering = ['-bulan']
    
    def __str__(self):
        return f"Laporan Keuangan - {self.bulan}"
    
    def save(self, *args, **kwargs):
        # Calculate saldo automatically
        self.saldo = self.total_pemasukan - self.total_pengeluaran
        super().save(*args, **kwargs)
    
    @classmethod
    def generateLaporan(cls, bulan_date):
        """
        Generate financial report for a specific month
        Calculate total income (pemasukan) from completed payments
        and total expenses (pengeluaran) from various sources
        """
        from datetime import datetime
        from django.db.models import Sum
        
        bulan_num = bulan_date.month
        tahun = bulan_date.year
        
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
            bulan=bulan_date,
            defaults={
                'total_pemasukan': total_pemasukan,
                'total_pengeluaran': total_pengeluaran,
                'saldo': saldo,
            }
        )
        
        return laporan
