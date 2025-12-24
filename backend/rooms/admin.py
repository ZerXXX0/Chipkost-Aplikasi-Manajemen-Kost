from django.contrib import admin
from .models import Kos, Room, Rental

@admin.register(Kos)
class KosAdmin(admin.ModelAdmin):
    list_display = ('name', 'address', 'owner', 'created_at')
    list_filter = ('owner', 'created_at')
    search_fields = ('name', 'address')
    readonly_fields = ('created_at', 'updated_at')

@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ('room_number', 'kos', 'price', 'status', 'penyewa')
    list_filter = ('kos', 'status')
    search_fields = ('room_number', 'kos__name')
    readonly_fields = ('created_at', 'updated_at')

@admin.register(Rental)
class RentalAdmin(admin.ModelAdmin):
    list_display = ('penyewa', 'room', 'start_date', 'end_date', 'status', 'harga_bulanan')
    list_filter = ('status', 'start_date', 'room__kos')
    search_fields = ('penyewa__username', 'room__room_number')
    readonly_fields = ('created_at', 'updated_at')
