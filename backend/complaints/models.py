from django.db import models
from django.contrib.auth import get_user_model
from rooms.models import Room

User = get_user_model()

class Kerusakan(models.Model):
    """Damage Report table (Tabel KERUSAKAN)"""
    STATUS_CHOICES = (
        ('pending', 'Tertunda'),
        ('in_progress', 'Sedang Dikerjakan'),
        ('resolved', 'Selesai'),
        ('rejected', 'Ditolak'),
    )
    
    PRIORITY_CHOICES = (
        ('low', 'Rendah'),
        ('medium', 'Sedang'),
        ('high', 'Tinggi'),
        ('urgent', 'Mendesak'),
    )
    
    laporan_id = models.AutoField(primary_key=True)
    kamar = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='kerusakan', verbose_name='Kamar')
    penyewa = models.ForeignKey(User, on_delete=models.CASCADE, related_name='laporan_kerusakan', limit_choices_to={'role': 'penyewa'}, verbose_name='Penyewa')
    deskripsi = models.TextField(verbose_name='Deskripsi', help_text="Jelaskan kerusakan dengan detail")
    tgl_lapor = models.DateTimeField(auto_now_add=True, verbose_name='Tanggal Lapor')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', verbose_name='Status')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium', verbose_name='Prioritas')
    image = models.ImageField(upload_to='damage_images/', blank=True, null=True, verbose_name='Gambar')
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_kerusakan', limit_choices_to={'role': 'admin'}, verbose_name='Ditugaskan ke')
    resolution_notes = models.TextField(blank=True, null=True, verbose_name='Catatan Penyelesaian')
    resolved_at = models.DateTimeField(null=True, blank=True, verbose_name='Diselesaikan pada')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Diperbarui pada')
    
    class Meta:
        db_table = 'kerusakan'
        verbose_name = 'Kerusakan'
        verbose_name_plural = 'Kerusakan'
        ordering = ['-tgl_lapor']
    
    def __str__(self):
        return f"Kerusakan {self.laporan_id} - {self.penyewa.username} ({self.get_status_display()})"

# Keep Complaint model for backward compatibility (alias)
Complaint = Kerusakan
