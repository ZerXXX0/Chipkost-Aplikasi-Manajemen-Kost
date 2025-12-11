from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Kos(models.Model):
    name = models.CharField(max_length=200, verbose_name='Nama Kos')
    address = models.TextField(verbose_name='Alamat')
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owned_kos', limit_choices_to={'role': 'admin'}, verbose_name='Pemilik')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Dibuat pada')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Diperbarui pada')
    
    class Meta:
        db_table = 'kos'
        verbose_name = 'Kos'
        verbose_name_plural = 'Kos'
    
    def __str__(self):
        return self.name

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
    penyewa = models.ForeignKey(User, on_delete=models.CASCADE, related_name='rentals', limit_choices_to={'role': 'penyewa'}, null=True, blank=True, verbose_name='Penyewa')
    start_date = models.DateField(verbose_name='Tanggal Mulai')
    end_date = models.DateField(blank=True, null=True, verbose_name='Tanggal Selesai')
    harga_bulanan = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Harga Bulanan')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active', verbose_name='Status')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Dibuat pada')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Diperbarui pada')
    
    class Meta:
        db_table = 'rentals'
        verbose_name = 'Penyewaan'
        verbose_name_plural = 'Penyewaan'
    
    def __str__(self):
        return f"{self.penyewa.username} - {self.room}"
