from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('penyewa', 'Penyewa'),
    )
    
    role = models.CharField(
        max_length=10, 
        choices=ROLE_CHOICES, 
        default='penyewa',
        verbose_name='Peran'
    )
    phone_number = models.CharField(
        max_length=15, 
        blank=True, 
        null=True,
        verbose_name='Nomor HP'
    )
    profile_picture = models.ImageField(
        upload_to='profile_pics/', 
        blank=True, 
        null=True,
        verbose_name='Foto Profil'
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Dibuat pada'
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name='Diperbarui pada'
    )
    
    class Meta:
        db_table = 'users'
        verbose_name = 'Pengguna'
        verbose_name_plural = 'Pengguna'
    
    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"
    
    def save(self, *args, **kwargs):
        # If user is a superuser, set role to admin
        if self.is_superuser:
            self.role = 'admin'
        super().save(*args, **kwargs)
    
    @property
    def is_admin(self):
        return self.role == 'admin'
    
    @property
    def is_penyewa(self):
        return self.role == 'penyewa'
