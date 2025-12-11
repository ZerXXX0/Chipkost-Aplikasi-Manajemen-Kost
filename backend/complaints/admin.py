from django.contrib import admin
from .models import Kerusakan

@admin.register(Kerusakan)
class KerusakanAdmin(admin.ModelAdmin):
    list_display = ('laporan_id', 'kamar', 'penyewa', 'status', 'priority', 'tgl_lapor')
    list_filter = ('status', 'priority', 'tgl_lapor')
    search_fields = ('penyewa__username', 'kamar__room_number', 'deskripsi')
    readonly_fields = ('tgl_lapor',)
