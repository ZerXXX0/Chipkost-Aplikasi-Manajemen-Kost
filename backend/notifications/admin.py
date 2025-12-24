from django.contrib import admin
from .models import Notif

@admin.register(Notif)
class NotifAdmin(admin.ModelAdmin):
    list_display = ('notif_id', 'user', 'status', 'tgl')
    list_filter = ('status', 'tgl')
    search_fields = ('user__username', 'pesan')
    readonly_fields = ('tgl',)
