from django.db import models
from django.contrib.auth import get_user_model
from django.db.models.signals import post_save
from django.dispatch import receiver

User = get_user_model()

class Kos(models.Model):
    name = models.CharField(max_length=200, verbose_name='Nama Kos')
    address = models.TextField(verbose_name='Alamat')
    cctv_url = models.URLField(max_length=500, null=True, blank=True, verbose_name='URL CCTV (MP4)')
    owner = models.ForeignKey(User, on_delete=models.SET_NULL, related_name='owned_kos', limit_choices_to={'role': 'admin'}, verbose_name='Pemilik', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Dibuat pada')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Diperbarui pada')
    
    class Meta:
        db_table = 'kos'
        verbose_name = 'Kos'
        verbose_name_plural = 'Kos'
    
    def __str__(self):
        return self.name


class CctvCamera(models.Model):
    kos = models.ForeignKey(Kos, on_delete=models.CASCADE, related_name='cctv_cameras', verbose_name='Kos')
    name = models.CharField(max_length=100, verbose_name='Nama Kamera')
    stream_url = models.URLField(max_length=500, verbose_name='URL Stream (MP4)')
    order = models.PositiveIntegerField(default=1, verbose_name='Urutan Tampil')
    is_active = models.BooleanField(default=True, verbose_name='Aktif')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Dibuat pada')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Diperbarui pada')

    class Meta:
        db_table = 'cctv_cameras'
        verbose_name = 'CCTV Kamera'
        verbose_name_plural = 'CCTV Kamera'
        ordering = ['order', 'id']
        unique_together = ('kos', 'order')

    def __str__(self):
        return f"{self.kos.name} - {self.name}"

class Room(models.Model):
    STATUS_CHOICES = (
        ('available', 'Tersedia'),
        ('occupied', 'Ditempati'),
        ('maintenance', 'Perbaikan'),
    )
    
    kos = models.ForeignKey(Kos, on_delete=models.CASCADE, related_name='rooms', verbose_name='Kos')
    room_number = models.CharField(max_length=10, verbose_name='Nomor Kamar', db_column='room_number')
    floor = models.IntegerField(default=1, verbose_name='Lantai')
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Harga', db_column='price')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='available', verbose_name='Status')
    description = models.TextField(blank=True, null=True, verbose_name='Deskripsi')
    capacity = models.IntegerField(default=1, verbose_name='Kapasitas')
    facilities = models.TextField(blank=True, null=True, verbose_name='Fasilitas')
    image = models.ImageField(upload_to='room_images/', blank=True, null=True, verbose_name='Gambar')
    penyewa = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='occupied_rooms', limit_choices_to={'role': 'penyewa'}, verbose_name='Penyewa')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Dibuat pada')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Diperbarui pada')
    
    class Meta:
        db_table = 'rooms'
        verbose_name = 'Kamar'
        verbose_name_plural = 'Kamar'
        unique_together = ('kos', 'room_number')
    
    def __str__(self):
        return f"{self.kos.name} - Room {self.room_number}"

class Rental(models.Model):
    STATUS_CHOICES = (
        ('active', 'Aktif'),
        ('expired', 'Kadaluarsa'),
        ('terminated', 'Dihentikan'),
    )
    
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='rentals', verbose_name='Kamar')
    penyewa = models.ForeignKey(User, on_delete=models.SET_NULL, related_name='rentals', limit_choices_to={'role': 'penyewa'}, null=True, blank=True, verbose_name='Penyewa')
    start_date = models.DateField(verbose_name='Tanggal Mulai')
    end_date = models.DateField(blank=True, null=True, verbose_name='Tanggal Selesai')
    harga_bulanan = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Harga Bulanan', db_column='monthly_price')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active', verbose_name='Status')
    notes = models.TextField(blank=True, null=True, verbose_name='Catatan')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Dibuat pada')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Diperbarui pada')
    
    class Meta:
        db_table = 'rentals'
        verbose_name = 'Penyewaan'
        verbose_name_plural = 'Penyewaan'
    
    def __str__(self):
        return f"{self.penyewa.username} - {self.room}"

# Signal to auto-update room status when penyewa changes
@receiver(post_save, sender=Room)
def update_room_status_on_penyewa_change(sender, instance, created, **kwargs):
    """
    Auto-update room status when penyewa is assigned or unassigned
    - If penyewa is assigned (not None), status should be 'occupied'
    - If penyewa is unassigned (None), status should be 'available' (unless maintenance)
    """
    if not created:  # Only on update, not on create
        # Check if penyewa changed
        try:
            old_instance = Room.objects.get(pk=instance.pk)
            penyewa_changed = old_instance.penyewa != instance.penyewa
            
            if penyewa_changed:
                if instance.penyewa is not None and instance.status != 'maintenance':
                    # Penyewa assigned, update status to occupied
                    if instance.status != 'occupied':
                        instance.status = 'occupied'
                        Room.objects.filter(pk=instance.pk).update(status='occupied')
                elif instance.penyewa is None and instance.status == 'occupied':
                    # Penyewa unassigned, update status to available
                    instance.status = 'available'
                    Room.objects.filter(pk=instance.pk).update(status='available')
        except Room.DoesNotExist:
            pass