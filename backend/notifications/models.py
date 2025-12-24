from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Notif(models.Model):
    """Notification table (Tabel NOTIF)"""
    STATUS_CHOICES = (
        ('unread', 'Belum Dibaca'),
        ('read', 'Sudah Dibaca'),
    )
    
    notif_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications', verbose_name='Pengguna')
    pesan = models.TextField(verbose_name='Pesan')
    tgl = models.DateTimeField(auto_now_add=True, verbose_name='Tanggal')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='unread', verbose_name='Status')
    
    class Meta:
        db_table = 'notif'
        verbose_name = 'Notifikasi'
        verbose_name_plural = 'Notifikasi'
        ordering = ['-tgl']
    
    def __str__(self):
        return f"Notif {self.notif_id} - {self.user.username} ({self.get_status_display()})"
